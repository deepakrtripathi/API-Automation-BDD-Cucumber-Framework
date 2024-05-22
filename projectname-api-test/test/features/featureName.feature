Feature: LOGIN


@sanity
Scenario Outline:  VALIDATE CREATE AND DELETE WATCHLIST END TO END WORKFLOW  - <api_name>
   When    call the "<method>" API using test data "<api_name>"
   Then    validate HTTP response code for "<api_name>"
   And     validate "<validation_type>" api response body for "<api_name>"
   Examples:
    | api_name  | method  |  validation_type |
    | CAN_LOGIN | POST    |  partial-keys    |