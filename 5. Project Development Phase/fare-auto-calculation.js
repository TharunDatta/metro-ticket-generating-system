// Copy this entire function into each of four onChange Catalog Client Scripts:
// starting_from, going_to, type_of_jouney, number_of_passengers.
// Catalog item: Book a Ticket. UI Type: All. Applies on Catalog Item view: checked.
// The station reference table must contain a field named u_station_name.
// The May 2025 matrix supplies fare zones; the 24 May 2025 tariff supplies amounts.
function onChange(control, oldValue, newValue, isLoading) {
    if (isLoading) {
        return;
    }

    var sourceId = g_form.getValue('starting_from');
    var destinationId = g_form.getValue('going_to');
    var journeyType = g_form.getValue('type_of_jouney');
    var passengers = Number(g_form.getValue('number_of_passengers'));

    // Remove an old quote whenever any input changes.
    g_form.setValue('amount_for_single_journey', '');
    g_form.setValue('amount_including_return', '');

    if (!sourceId || !destinationId || sourceId === destinationId ||
        (journeyType !== '1' && journeyType !== '2') ||
        passengers < 1 || passengers > 4 ||
        Math.floor(passengers) !== passengers) {
        return;
    }

    // PDF station order: Miyapur to LB Nagar (Red Line).
    var stationKeys = [
        'miyapur', 'jntucollege', 'kphbcolony', 'kukatpally', 'drbrambedkarbalanagar',
        'moosapet', 'bharatnagar', 'erragadda', 'esihospital', 'srnagar',
        'ameerpet', 'punjagutta', 'irrummanzil', 'khairatabad', 'lakdikapul',
        'assembly', 'nampally', 'gandhibhavan', 'osmaniamedicalcollege', 'mgbusstation',
        'malakpet', 'newmarket', 'musarambagh', 'dilsukhnagar', 'chaitanyapuri',
        'victoriamemorial', 'lbnagar'
    ];

    // Rows and columns have the same order as stationKeys.
    // These are the printed May 15 chart values, used here to identify the zone.
    var printedFareRows = [
        "12 12 18 30 40 40 40 40 50 50 50 55 55 55 60 60 60 66 66 66 66 70 70 75 75 75 75", // Miyapur
        "12 12 12 18 30 30 40 40 40 40 50 50 50 55 55 55 60 60 60 60 66 66 66 70 70 75 75", // JNTU College
        "18 12 12 12 18 18 30 30 40 40 40 50 50 50 55 55 55 55 60 60 60 66 66 70 70 70 75", // KPHB Colony
        "30 18 12 12 12 18 18 18 30 30 40 40 40 50 50 50 55 55 55 60 60 60 66 66 66 70 70", // Kukatpally
        "40 30 18 12 12 12 12 18 18 30 30 40 40 40 50 50 50 50 55 55 55 60 60 66 66 66 70", // Dr. B. R. Ambedkar Balanagar
        "40 30 18 18 12 12 12 12 18 18 30 30 40 40 40 50 50 50 55 55 55 55 60 60 66 66 70", // Moosapet
        "40 40 30 18 12 12 12 12 18 18 18 30 30 40 40 40 50 50 50 50 55 55 55 60 60 66 66", // Bharat Nagar
        "40 40 30 18 18 12 12 12 12 12 18 18 30 30 40 40 40 50 50 50 50 55 55 60 60 60 66", // Erragadda
        "50 40 40 30 18 18 18 12 12 12 12 18 18 30 30 40 40 40 50 50 50 50 55 55 60 60 66", // ESI Hospital
        "50 40 40 30 30 18 18 12 12 12 12 12 18 18 30 40 40 40 40 50 50 50 55 55 55 60 60", // S.R. Nagar
        "50 50 40 40 30 30 18 18 12 12 12 12 18 18 30 30 30 40 40 40 50 50 50 55 55 60 60", // Ameerpet
        "55 50 50 40 40 30 30 18 18 12 12 12 12 18 18 30 30 30 40 40 40 50 50 50 55 55 60", // Punjagutta
        "55 50 50 40 40 40 30 30 18 18 18 12 12 12 18 18 18 30 30 40 40 40 50 50 50 55 55", // Irrum Manzil
        "55 55 50 50 40 40 40 30 30 18 18 18 12 12 12 18 18 18 30 30 40 40 40 50 50 50 55", // Khairatabad
        "60 55 55 50 50 40 40 40 30 30 30 18 18 12 12 12 12 18 18 30 30 40 40 40 50 50 55", // Lakdi-ka-pul
        "60 55 55 50 50 50 40 40 40 40 30 30 18 18 12 12 12 12 18 18 18 30 40 40 40 50 50", // Assembly
        "60 60 55 55 50 50 50 40 40 40 30 30 18 18 12 12 12 12 12 18 18 30 30 40 40 50 50", // Nampally
        "66 60 55 55 50 50 50 50 40 40 40 30 30 18 18 12 12 12 12 12 18 18 30 40 40 40 50", // Gandhi Bhavan
        "66 60 60 55 55 55 50 50 50 40 40 40 30 30 18 18 12 12 12 12 12 18 18 30 40 40 40", // Osmania Medical College
        "66 60 60 60 55 55 50 50 50 50 40 40 40 30 30 18 18 12 12 12 12 18 18 30 30 40 40", // MG Bus Station
        "66 66 60 60 55 55 55 50 50 50 50 40 40 40 30 18 18 18 12 12 12 12 18 18 30 30 40", // Malakpet
        "70 66 66 60 60 55 55 55 50 50 50 50 40 40 40 30 30 18 18 18 12 12 12 18 18 30 40", // New Market
        "70 66 66 66 60 60 55 55 55 55 50 50 50 40 40 40 30 30 18 18 18 12 12 12 18 18 30", // Musarambagh
        "75 70 70 66 66 60 60 60 55 55 55 50 50 50 40 40 40 40 30 30 18 18 12 12 12 18 18", // Dilsukhnagar
        "75 70 70 66 66 66 60 60 60 55 55 55 50 50 50 40 40 40 40 30 30 18 18 12 12 12 18", // Chaitanyapuri
        "75 75 70 70 66 66 66 60 60 60 60 55 55 50 50 50 50 40 40 40 30 30 18 18 12 12 12", // Victoria Memorial
        "75 75 75 70 70 70 66 66 66 60 60 60 55 55 55 50 50 50 40 40 40 40 30 18 18 12 12" // L B Nagar
    ];

    // The operator's later discounted tariff effective 24 May 2025.
    var currentFareByPrintedFare = {
        12: 11, 18: 17, 30: 28, 40: 37, 50: 47,
        55: 51, 60: 56, 66: 61, 70: 65, 75: 69
    };

    function stationKey(value) {
        return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    }

    function inputsUnchanged() {
        return g_form.getValue('starting_from') === sourceId &&
            g_form.getValue('going_to') === destinationId &&
            g_form.getValue('type_of_jouney') === journeyType &&
            Number(g_form.getValue('number_of_passengers')) === passengers;
    }

    function referenceStationName(record, variableName) {
        var name = '';
        if (record && typeof record.getValue === 'function') {
            name = record.getValue('u_station_name');
        }
        if (!name && record && record.u_station_name != null) {
            name = record.u_station_name;
            if (typeof name === 'object' && name.value != null) {
                name = name.value;
            }
        }
        if (!name && typeof g_form.getDisplayValue === 'function') {
            name = g_form.getDisplayValue(variableName);
        }
        return String(name || '');
    }

    g_form.getReference('starting_from', function (sourceRecord) {
        if (!inputsUnchanged() || !sourceRecord) {
            return;
        }
        g_form.getReference('going_to', function (destinationRecord) {
            if (!inputsUnchanged() || !destinationRecord) {
                return;
            }

            var from = stationKeys.indexOf(stationKey(referenceStationName(sourceRecord, 'starting_from')));
            var to = stationKeys.indexOf(stationKey(referenceStationName(destinationRecord, 'going_to')));
            if (from < 0 || to < 0 || from === to) {
                return; // Station is not in this 27-station Red Line chart.
            }

            var printedFare = Number(printedFareRows[from].split(' ')[to]);
            var oneWayFare = currentFareByPrintedFare[printedFare];
            if (!oneWayFare) {
                return;
            }

            if (journeyType === '1') {
                g_form.setValue('amount_for_single_journey',
                    String(oneWayFare * passengers));
            } else {
                // Project assumption: a return journey is two single journeys.
                g_form.setValue('amount_including_return',
                    String(oneWayFare * passengers * 2));
            }
        });
    });
}
