select created_at, event_data
from audit_events
where event_type = 'organisation.signing_certificate_replace_failed'
order by created_at desc
limit 5;