#!/usr/bin/env python3
"""Generate a starter tracking plan for GA4 and GTM from a small JSON brief."""

from __future__ import annotations

import argparse
import json
from copy import deepcopy

SAMPLE_INPUT = {
    "business_type": "saas",
    "key_pages": [
        {"name": "Homepage", "path": "/"},
        {"name": "Pricing", "path": "/pricing"},
        {"name": "Signup", "path": "/signup"},
        {"name": "Dashboard", "path": "/app/dashboard"},
    ],
    "conversion_actions": [
        {"name": "Signup", "type": "registration"},
        {"name": "Trial Start", "type": "trial"},
        {"name": "Purchase", "type": "purchase", "value": 99},
        {"name": "Demo Request", "type": "lead"},
    ],
    "paid_channels": ["google_ads"],
    "consent_required": True,
}

EVENT_TEMPLATES = {
    "saas": [
        {
            "event": "pricing_viewed",
            "category": "acquisition",
            "trigger": "User reaches the pricing page",
            "parameters": ["page_location", "referrer_page", "utm_source"],
            "priority": "high",
        },
        {
            "event": "signup_started",
            "category": "registration",
            "trigger": "User clicks the main signup CTA",
            "parameters": ["page_location", "cta_text", "plan_name"],
            "priority": "high",
        },
        {
            "event": "signup_completed",
            "category": "registration",
            "trigger": "Account creation succeeds",
            "parameters": ["method", "user_id", "plan_name"],
            "priority": "critical",
            "is_conversion": True,
        },
        {
            "event": "trial_started",
            "category": "registration",
            "trigger": "A free trial starts",
            "parameters": ["plan_name", "trial_length_days", "user_id"],
            "priority": "critical",
            "is_conversion": True,
        },
        {
            "event": "onboarding_step_completed",
            "category": "onboarding",
            "trigger": "A user completes an onboarding step",
            "parameters": ["step_name", "step_number", "user_id"],
            "priority": "high",
        },
        {
            "event": "feature_activated",
            "category": "onboarding",
            "trigger": "A user activates a key feature for the first time",
            "parameters": ["feature_name", "user_id", "activation_method"],
            "priority": "medium",
        },
        {
            "event": "plan_selected",
            "category": "conversion",
            "trigger": "A pricing plan is selected",
            "parameters": ["plan_name", "billing_period", "value"],
            "priority": "critical",
        },
        {
            "event": "checkout_started",
            "category": "conversion",
            "trigger": "Checkout begins",
            "parameters": ["plan_name", "value", "currency", "billing_period"],
            "priority": "critical",
        },
        {
            "event": "checkout_completed",
            "category": "conversion",
            "trigger": "Payment succeeds",
            "parameters": ["plan_name", "value", "currency", "transaction_id"],
            "priority": "critical",
            "is_conversion": True,
        },
        {
            "event": "demo_requested",
            "category": "acquisition",
            "trigger": "A demo request form is submitted",
            "parameters": ["source", "page_location", "form_name"],
            "priority": "high",
            "is_conversion": True,
        },
        {
            "event": "subscription_cancelled",
            "category": "retention",
            "trigger": "A cancellation is confirmed",
            "parameters": ["cancel_reason", "plan_name"],
            "priority": "high",
        },
    ],
    "default": [
        {
            "event": "page_viewed",
            "category": "navigation",
            "trigger": "A meaningful page is viewed",
            "parameters": ["page_location", "page_title"],
            "priority": "high",
        }
    ],
}

USER_DIMENSIONS = [
    {"name": "User ID", "parameter": "user_id"},
    {"name": "Plan Name", "parameter": "plan_name"},
    {"name": "Billing Period", "parameter": "billing_period"},
]

EVENT_DIMENSIONS = [
    {"name": "Feature Name", "parameter": "feature_name"},
    {"name": "Form Name", "parameter": "form_name"},
    {"name": "Cancel Reason", "parameter": "cancel_reason"},
]


def build_plan(config: dict) -> dict:
    business_type = config.get("business_type", "default")
    base_events = deepcopy(EVENT_TEMPLATES.get(business_type, EVENT_TEMPLATES["default"]))
    conversions = _conversion_targets(config.get("conversion_actions", []))

    for event in base_events:
        if event["event"] in conversions:
            event["is_conversion"] = True
            if conversions[event["event"]].get("value") is not None:
                event["value_hint"] = conversions[event["event"]]["value"]

    gtm_tags = []
    for event in base_events:
        gtm_tags.append(
            {
                "tag_name": f"GA4 - {event['event']}",
                "trigger": f"DL Event - {event['event']}",
                "parameters": event["parameters"],
                "priority": event["priority"],
            }
        )

    paid_channels = set(config.get("paid_channels", []))
    ad_notes = []
    if "google_ads" in paid_channels:
        ad_notes.append("Import critical GA4 conversions into Google Ads after taxonomy is stable.")
    if "meta" in paid_channels:
        ad_notes.append("Map Meta events separately; do not overload GA4 event names with platform-specific variants.")

    return {
        "business_type": business_type,
        "pages": config.get("key_pages", []),
        "events": base_events,
        "gtm_tags": gtm_tags,
        "user_dimensions": USER_DIMENSIONS,
        "event_dimensions": EVENT_DIMENSIONS,
        "consent_required": bool(config.get("consent_required", False)),
        "ad_channel_notes": ad_notes,
    }


def _conversion_targets(actions: list[dict]) -> dict[str, dict]:
    mapping = {}
    for action in actions:
        action_type = action.get("type")
        if action_type == "registration":
            mapping["signup_completed"] = action
        elif action_type == "trial":
            mapping["trial_started"] = action
        elif action_type == "purchase":
            mapping["checkout_completed"] = action
        elif action_type == "lead":
            mapping["demo_requested"] = action
    return mapping


def print_human(plan: dict) -> None:
    print("Tracking plan")
    print("=============")
    print(f"Business type: {plan['business_type']}")
    print(f"Consent required: {'yes' if plan['consent_required'] else 'no'}")
    print()
    print("Critical events:")
    for event in plan["events"]:
        marker = " (conversion)" if event.get("is_conversion") else ""
        print(f"- {event['event']} [{event['category']}, {event['priority']}] {event['trigger']}{marker}")
    print()
    print("Recommended user dimensions:")
    for item in plan["user_dimensions"]:
        print(f"- {item['parameter']}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input_file", nargs="?", help="Path to JSON input file")
    parser.add_argument("--json", action="store_true", help="Emit JSON instead of human-readable output")
    args = parser.parse_args()

    if args.input_file:
        with open(args.input_file, "r", encoding="utf-8") as fh:
            config = json.load(fh)
    else:
        config = SAMPLE_INPUT

    plan = build_plan(config)
    if args.json:
        print(json.dumps(plan, indent=2))
    else:
        print_human(plan)


if __name__ == "__main__":
    main()
