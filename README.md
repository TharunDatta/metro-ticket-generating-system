# Metro Ticket Generating System in ServiceNow

A ServiceNow Service Catalog prototype for choosing a metro route, viewing its fare, and previewing a QR code.

## Passenger workflow

1. Open **Service Portal → Service Catalog → Services → Book a Ticket**.
2. Select the starting and destination stations, journey type, and passenger count.
3. Changing the passenger count runs the fare script, which reads the route and journey type and fills the applicable read-only amount field.
4. Select a payment mode. Choosing **Others** reveals a required payment-mode detail field.
5. Select **Checkout** to open the Metro QR Widget preview.

The QR uses the exercise's example ticket URL. The saved `onSubmit` script cancels submission, so this demonstration does not complete a payment or create a confirmed ticket.

## ServiceNow workflow

`Metro Station Details` (`u_metro_station_details`) supplies station references → the **Book a Ticket** catalog item collects inputs → the fare Catalog Client Script calculates the amount → a Catalog UI Policy controls the payment detail field → `QRGeneration` passes a QR image URL to the `metro_qr_widget` Service Portal widget.

## Repository guide

- **1–4:** Ideation, requirements, design, and planning PDFs.
- **5:** Source snapshots plus testing plans and UAT record.
- **6:** Functional specification, setup manual, final report, and conclusion.
- **7:** Demo video and presentation plan.

See the [Setup Manual](6.%20Project%20Documentation/03%20Setup%20Manual.pdf) to recreate the prototype. These files document the configuration; they are not a ServiceNow application export.
