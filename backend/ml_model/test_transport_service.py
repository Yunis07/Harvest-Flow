from transport_service import analyze_transport

result = analyze_transport(
    crop="Rice",
    from_city="Chennai",
    to_city="Bangalore",
    distance_km=350
)

print(result)
