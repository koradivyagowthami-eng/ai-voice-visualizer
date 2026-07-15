"""Server-side current conversion logic."""

from decimal import Decimal, InvalidOperation

from django.shortcuts import render


# Each unit's value expressed in amperes.
UNITS = {
    "A": {"name": "Ampere (A)", "factor": Decimal("1")},
    "mA": {"name": "Milliampere (mA)", "factor": Decimal("0.001")},
    "uA": {"name": "Microampere (µA)", "factor": Decimal("0.000001")},
}


def converter(request):
    """Display the form and calculate a result after form submission."""
    value = request.GET.get("value", "")
    from_unit = request.GET.get("from_unit", "A")
    to_unit = request.GET.get("to_unit", "mA")
    result = None
    error = None

    # A submitted form supplies a value. Convert through amperes for accuracy.
    if value:
        try:
            number = Decimal(value)
            if from_unit not in UNITS or to_unit not in UNITS:
                raise InvalidOperation
            result = (number * UNITS[from_unit]["factor"]) / UNITS[to_unit]["factor"]
            result = format(result.normalize(), "f")
        except (InvalidOperation, ValueError):
            error = "Please enter a valid current value."

    return render(
        request,
        "converter/index.html",
        {
            "units": UNITS,
            "value": value,
            "from_unit": from_unit,
            "to_unit": to_unit,
            "result": result,
            "error": error,
        },
    )
