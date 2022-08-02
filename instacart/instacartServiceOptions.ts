import { find, findIndex } from "lodash";

class InstacartServiceOptionTier {
  public static priority = new InstacartServiceOptionTier('priority');
  public static standard = new InstacartServiceOptionTier('standard');
  public static noRushScheduled = new InstacartServiceOptionTier('noRushScheduled');
  public static noRushDiscounted = new InstacartServiceOptionTier('noRushDiscounted');

  private static validTiers = new Set([
    this.priority.name,
    this.standard.name,
    this.noRushScheduled.name,
    this.noRushDiscounted.name,
  ]);

  private constructor(private readonly name: string) { }

  public static create(name: string): InstacartServiceOptionTier {
    if (!name) {
      throw new Error('ServiceOptionTier name is required');
    }

    if (!this.validTiers.has(name)) {
      throw new Error(`ServiceOptionTier name ${name} is not valid`);
    }

    return new InstacartServiceOptionTier(name);
  }

  equals(other: InstacartServiceOptionTier): boolean {
    return this.name === other.name;
  }
}

export class InstacartServiceOption {
  private constructor(
    private readonly id: number,
    private readonly tier: InstacartServiceOptionTier,
    private readonly formattedDate: string) { }

  public static create(id: number, tier: string, formattedDate: string): InstacartServiceOption {
    return new InstacartServiceOption(id, InstacartServiceOptionTier.create(tier), formattedDate);
  }

  hasTodayDate() {
    return !!this.formattedDate.match(/Today/);
  }

  hasTomorrowDate() {
    return !!this.formattedDate.match(/Tomorrow/);
  }

  isNoRushDiscountedTier() {
    return this.tier.equals(InstacartServiceOptionTier.noRushDiscounted);
  }

  isNoRushScheduledTier() {
    return this.tier.equals(InstacartServiceOptionTier.noRushScheduled);
  }
}

export class InstacartServiceOptions {
  private CHEAPEST_OPTION_RULES = [
    this.findNoRushDiscountedOptionToday,
    this.findStandardOption,
    this.findNextNoRushDiscountedOption
  ];

  constructor(private readonly serviceOptions: InstacartServiceOption[]) { }

  /**
   * ServiceOptions are sorted already by their availability coming from IC
   * @returns {InstacartServiceOption}
   */
  getCheapestOption(): InstacartServiceOption {
    for (const func of this.CHEAPEST_OPTION_RULES) {
      const option = func.bind(this)();
      if (option) {
        return option;
      }
    }

    throw new Error("Found no cheap option; store unavailable!");
  }

  private findNoRushDiscountedOptionToday() {
    return find(
      this.serviceOptions,
      o => o.isNoRushDiscountedTier() && o.hasTodayDate()
    );
  }

  private findStandardOption() {
    const idx = findIndex(this.serviceOptions, o => o.isNoRushScheduledTier() && o.hasTodayDate());
    if (idx === 0) {
      return this.serviceOptions[idx];
    }
  }

  private findNextNoRushDiscountedOption() {
    return find(
      this.serviceOptions,
      o => o.isNoRushDiscountedTier() && o.hasTomorrowDate()
    );
  }
}

