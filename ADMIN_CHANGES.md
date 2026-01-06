# ÄNDRINGAR FÖR TORREVIEJAPLUS - PACKAGE & PAYMENT

## ✅ KLART - Ändringar gjorda i koden:

### admin.html
1. ✅ Package & Payment Date fält tillagda i Add Venue formuläret
2. ✅ createVenue() sparar package och payment_date till databasen
3. ✅ editVenue() fyller i package och payment_date vid redigering
4. ✅ cancelEdit() återställer fälten
5. ✅ Payments-tabben läser nu från venues-tabellen i databasen
6. ✅ markAsPaid() sparar payment_date till databasen
7. ✅ markAsUnpaid() tar bort payment_date från databasen

### VenueSettingsScreen.js (Appen)
1. ✅ Visar paketnamn dynamiskt (Bronze/Silver/Gold)
2. ✅ Ny rad med pris och betalningsdatum: "499 Euro (Paid 2025-01-05)"

---

## ❌ KVAR ATT GÖRA - Supabase Databas

Kör detta i Supabase SQL Editor:

```sql
-- Lägg till kolumner i venues tabellen
ALTER TABLE venues ADD COLUMN IF NOT EXISTS package TEXT DEFAULT 'Gold';
ALTER TABLE venues ADD COLUMN IF NOT EXISTS payment_date DATE;
```

---

## Paketpriser
- Bronze: €99
- Silver: €199
- Gold: €499
