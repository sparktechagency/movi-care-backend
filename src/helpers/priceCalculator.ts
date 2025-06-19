type RideFareInput = {
    serviceFee: number;
    distanceKm: number;
    durationHours: number;
    ratePerKm: number;
    ratePerHour: number;
    passengers: number;
    ratePerExtraPerson: number;
    taxRate: number;
    fixedProcessingFee: number;
  };
  
  type RideFareOutput = {
    serviceFee: number;
    baseFare: number;
    additionalTravellersFee: number;
    subtotal: number;
    taxesAndFees: number;
    total: number;
  };
  
export function calulatePrice(input: RideFareInput): RideFareOutput {
    const {
      serviceFee,
      distanceKm,
      durationHours,
      ratePerKm,
      ratePerHour,
      passengers,
      ratePerExtraPerson,
      taxRate,
      fixedProcessingFee
    } = input;
    
    
  
    const baseFare = (distanceKm * ratePerKm) + (durationHours * ratePerHour);
    const extraTravellers = Math.max(passengers - 1, 0);
    const additionalTravellersFee = extraTravellers * ratePerExtraPerson;
    const subtotal = serviceFee + baseFare + additionalTravellersFee;
    const taxesAndFees = (subtotal * (taxRate / 100)) + fixedProcessingFee;
    const total = parseFloat((subtotal + taxesAndFees).toFixed(2));
  
    return {
      serviceFee,
      baseFare,
      additionalTravellersFee,
      subtotal: parseFloat(subtotal.toFixed(2)),
      taxesAndFees: parseFloat(taxesAndFees.toFixed(2)),
      total
    };
  }
  