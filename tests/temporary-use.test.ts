import { describe, it, expect, beforeEach } from "vitest"

// Mock the Clarity VM environment
const mockClarity = {
  blockHeight: 100,
  txSender: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
  temporaryUses: new Map(),
  propertyUseCounts: new Map(),
  properties: new Map(),
}

// Mock the property-registration contract
const propertyRegistration = {
  getProperty: (propertyId) => {
    const property = mockClarity.properties.get(propertyId)
    return property ? { type: "some", value: property } : { type: "none" }
  },
}

// Mock the contract functions
const temporaryUse = {
  requestTemporaryUse: (propertyId, purpose, duration) => {
    // Check if property exists
    const property = propertyRegistration.getProperty(propertyId)
    if (property.type === "none") {
      return { type: "err", value: 1 }
    }
    
    // Check if property is vacant
    if (property.value.status !== "vacant") {
      return { type: "err", value: 2 }
    }
    
    // Get current use count
    const currentCount = mockClarity.propertyUseCounts.get(propertyId) || { count: 0 }
    const newUseId = currentCount.count + 1
    
    // Update use count
    mockClarity.propertyUseCounts.set(propertyId, { count: newUseId })
    
    // Create new use request
    const useKey = `${propertyId}-${newUseId}`
    mockClarity.temporaryUses.set(useKey, {
      user: mockClarity.txSender,
      purpose,
      startDate: mockClarity.blockHeight,
      endDate: mockClarity.blockHeight + duration,
      status: "pending",
    })
    
    return { type: "ok", value: newUseId }
  },
  
  approveTemporaryUse: (propertyId, useId) => {
    // Check if property exists
    const property = propertyRegistration.getProperty(propertyId)
    if (property.type === "none") {
      return { type: "err", value: 1 }
    }
    
    // Check if use request exists
    const useKey = `${propertyId}-${useId}`
    const useRequest = mockClarity.temporaryUses.get(useKey)
    if (!useRequest) {
      return { type: "err", value: 2 }
    }
    
    // Check if approver is property owner
    if (mockClarity.txSender !== property.value.owner) {
      return { type: "err", value: 3 }
    }
    
    // Update use request status
    useRequest.status = "approved"
    mockClarity.temporaryUses.set(useKey, useRequest)
    
    return { type: "ok", value: true }
  },
  
  getTemporaryUse: (propertyId, useId) => {
    const useKey = `${propertyId}-${useId}`
    const useRequest = mockClarity.temporaryUses.get(useKey)
    return useRequest ? { type: "some", value: useRequest } : { type: "none" }
  },
  
  getActiveUses: (propertyId) => {
    const count = mockClarity.propertyUseCounts.get(propertyId) || { count: 0 }
    return count.count
  },
}

describe("Temporary Use Contract", () => {
  beforeEach(() => {
    // Reset the mock state
    mockClarity.temporaryUses.clear()
    mockClarity.propertyUseCounts.clear()
    mockClarity.properties.clear()
    mockClarity.blockHeight = 100
    mockClarity.txSender = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"
    
    // Set up a test property
    mockClarity.properties.set(1, {
      owner: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
      location: "123 Main St",
      propertyType: "building",
      size: 2500,
      registrationDate: 90,
      status: "vacant",
    })
  })
  
  it("should request temporary use of a property", () => {
    const result = temporaryUse.requestTemporaryUse(
        1,
        "Community garden",
        100, // duration in blocks
    )
    
    expect(result.type).toBe("ok")
    expect(result.value).toBe(1) // first use ID
    
    const useRequest = temporaryUse.getTemporaryUse(1, 1)
    expect(useRequest.type).toBe("some")
    expect(useRequest.value.purpose).toBe("Community garden")
    expect(useRequest.value.status).toBe("pending")
    expect(useRequest.value.endDate).toBe(200) // 100 + 100
  })
  
  it("should fail to request use for non-existent property", () => {
    const result = temporaryUse.requestTemporaryUse(999, "Community garden", 100)
    
    expect(result.type).toBe("err")
    expect(result.value).toBe(1) // Error code for property not found
  })
  
  it("should approve a temporary use request", () => {
    // First create a use request
    temporaryUse.requestTemporaryUse(1, "Community garden", 100)
    
    // Then approve it
    const result = temporaryUse.approveTemporaryUse(1, 1)
    
    expect(result.type).toBe("ok")
    expect(result.value).toBe(true)
    
    const useRequest = temporaryUse.getTemporaryUse(1, 1)
    expect(useRequest.value.status).toBe("approved")
  })
  
  it("should fail to approve if not property owner", () => {
    // First create a use request
    temporaryUse.requestTemporaryUse(1, "Community garden", 100)
    
    // Change tx-sender to someone else
    mockClarity.txSender = "ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG"
    
    // Try to approve
    const result = temporaryUse.approveTemporaryUse(1, 1)
    
    expect(result.type).toBe("err")
    expect(result.value).toBe(3) // Error code for not being the owner
  })
  
  it("should track multiple use requests for a property", () => {
    temporaryUse.requestTemporaryUse(1, "Community garden", 100)
    temporaryUse.requestTemporaryUse(1, "Art exhibition", 50)
    
    expect(temporaryUse.getActiveUses(1)).toBe(2)
    
    const use1 = temporaryUse.getTemporaryUse(1, 1)
    const use2 = temporaryUse.getTemporaryUse(1, 2)
    
    expect(use1.value.purpose).toBe("Community garden")
    expect(use2.value.purpose).toBe("Art exhibition")
  })
})

