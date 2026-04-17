# Mock LPG Agency Demo Data

This project seeds a believable LPG agency verification dataset for hackathon demos.

## Agencies

- `IND001` -> Indian Oil Corporation
- `BHP001` -> Bharat Petroleum
- `HIN001` -> Hindustan Petroleum

## Demo test records

### Fresh registration flows

1. Indian Oil, no email on file
   - `agency_code`: `IND001`
   - `passbook_number`: `11012026000000002`
   - `registered_phone`: `+918329754847`
   - Expected result:
     Agency validation passes, OTP can be sent, profile opens with empty email field.

2. Bharat Petroleum, email already present
   - `agency_code`: `BHP001`
   - `passbook_number`: `22022026000000005`
   - `registered_phone`: `+919820200115`
   - Expected result:
     Agency validation passes, OTP can be sent, profile opens with prefilled email.

3. Hindustan Petroleum, rural profile
   - `agency_code`: `HIN001`
   - `passbook_number`: `33032026000000010`
   - `registered_phone`: `+919830300130`
   - Expected result:
     Agency validation passes, OTP can be sent, rural address autofills on profile step.

### Existing user conflict flows

1. Already registered Indian Oil user
   - `agency_code`: `IND001`
   - `passbook_number`: `11012026000000001`
   - `registered_phone`: `+919810100101`
   - login password: `Demo123`
   - Expected result:
     Registration should be blocked with "already registered", login should succeed.

2. Already registered Bharat user
   - `agency_code`: `BHP001`
   - `passbook_number`: `22022026000000001`
   - `registered_phone`: `+919820200111`
   - login password: `Demo123`

3. Already registered Hindustan user
   - `agency_code`: `HIN001`
   - `passbook_number`: `33032026000000001`
   - `registered_phone`: `+919830300121`
   - login password: `Demo123`

### Invalid-data demo cases

1. Wrong agency with a valid passbook
   - `agency_code`: `BHP001`
   - `passbook_number`: `11012026000000002`
   - Expected result:
     Validation fails because the passbook belongs to another agency.

2. Unknown passbook number
   - `agency_code`: `IND001`
   - `passbook_number`: `11012026999999999`
   - Expected result:
     Validation fails with consumer-not-found behavior.

## Why this dataset feels realistic

- Names use varied Indian naming patterns across North, East, and South India.
- Addresses mix apartments, plotted homes, small-town wards, and village references.
- 15 consumers have email and 15 do not, which is useful for demonstrating the email-completion step.
- 3 consumers are pre-registered so you can show both happy-path onboarding and duplicate-account prevention.
