#!/usr/bin/env python3
"""Simple TAM/SAM/SOM calculator for market sizing workflows."""

from __future__ import annotations

import argparse
from dataclasses import dataclass


@dataclass(frozen=True)
class MarketSizing:
    tam: float
    sam: float
    som: float


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Calculate TAM, SAM, and SOM.")
    parser.add_argument("--tam", type=float, help="Known total addressable market value.")
    parser.add_argument("--population", type=float, help="Addressable customer or account count.")
    parser.add_argument("--arpu", type=float, help="Revenue basis per customer or account.")
    parser.add_argument(
        "--sam-share",
        type=float,
        required=True,
        help="Serviceable share as a decimal between 0 and 1.",
    )
    parser.add_argument(
        "--som-share",
        type=float,
        required=True,
        help="Obtainable share of SAM as a decimal between 0 and 1.",
    )
    return parser.parse_args()


def validate_share(value: float, name: str) -> None:
    if not 0 <= value <= 1:
        raise SystemExit(f"{name} must be between 0 and 1.")


def calculate_tam(args: argparse.Namespace) -> float:
    if args.tam is not None:
        return args.tam
    if args.population is None or args.arpu is None:
        raise SystemExit("Provide --tam or both --population and --arpu.")
    return args.population * args.arpu


def calculate_market_sizes(args: argparse.Namespace) -> MarketSizing:
    validate_share(args.sam_share, "sam-share")
    validate_share(args.som_share, "som-share")
    tam = calculate_tam(args)
    sam = tam * args.sam_share
    som = sam * args.som_share
    return MarketSizing(tam=tam, sam=sam, som=som)


def format_currency(value: float) -> str:
    return f"${value:,.2f}"


def print_summary(result: MarketSizing, args: argparse.Namespace) -> None:
    print("| Metric | Value |")
    print("| --- | ---: |")
    print(f"| TAM | {format_currency(result.tam)} |")
    print(f"| SAM | {format_currency(result.sam)} |")
    print(f"| SOM | {format_currency(result.som)} |")
    print()
    print("Assumptions:")
    if args.tam is not None:
        print(f"- Known TAM input: {format_currency(args.tam)}")
    else:
        print(f"- Population: {args.population:,.0f}")
        print(f"- Revenue basis: {format_currency(args.arpu)}")
    print(f"- SAM share: {args.sam_share:.2%}")
    print(f"- SOM share of SAM: {args.som_share:.2%}")


def main() -> None:
    args = parse_args()
    result = calculate_market_sizes(args)
    print_summary(result, args)


if __name__ == "__main__":
    main()
