
const findTier = (
    data: InstacartGetServiceOptions, 
    type: InstacartServiceOptionTierType) => {
    return find(
        data.getServiceOptions.tiers,
        tier => tier.type === type && tier.isAvailable
    )
};

const isTierForToday = (tier: InstacartServiceOptionTier) => tier.viewSection.secondaryLabelString.match(/Today/);

const isTierAvailableToday = (data: InstacartGetServiceOptions, type: InstacartServiceOptionTierType) => {
    const tier = findTier(data, type);

    return !!(tier && isTierForToday(tier));
}

const isNoRushDiscountedTierAvailableToday = (data: InstacartGetServiceOptions) => isTierAvailableToday(data, InstacartServiceOptionTierType.NO_RUSH_DISCOUNTED);
