;; Simple Temporary Use Contract

(define-map uses
  { property-id: uint, use-id: uint }
  {
    user: principal,
    purpose: (string-utf8 100),
    approved: bool
  }
)

(define-map use-counters
  { property-id: uint }
  { count: uint }
)

(define-public (request-use (property-id uint) (purpose (string-utf8 100)))
  (let (
    (counter (default-to { count: u0 } (map-get? use-counters { property-id: property-id })))
    (new-id (+ (get count counter) u1))
  )
    (map-set use-counters { property-id: property-id } { count: new-id })
    (map-set uses
      { property-id: property-id, use-id: new-id }
      {
        user: tx-sender,
        purpose: purpose,
        approved: false
      }
    )
    (ok new-id)
  )
)

(define-public (approve-use (property-id uint) (use-id uint))
  (let ((use (unwrap! (map-get? uses { property-id: property-id, use-id: use-id }) (err u1))))
    (map-set uses
      { property-id: property-id, use-id: use-id }
      (merge use { approved: true })
    )
    (ok true)
  )
)

(define-read-only (get-use (property-id uint) (use-id uint))
  (map-get? uses { property-id: property-id, use-id: use-id })
)

