import { InstacartGetServiceOptions } from "./instacartGetServiceOptions";
import { InstacartServiceOption, InstacartServiceOptions } from "./instacartServiceOptions";
import { find, map } from 'lodash';

const mapServiceOption = (data: InstacartGetServiceOptions, serviceOptionId: number): InstacartServiceOption => {
    const option = find(data.getServiceOptions.serviceOptions, o => o.id === serviceOptionId);
    if (!option) {
        throw new Error("Option not found; code need adjustment to accomodate IC payload");
    }

    const section = find(option.viewSection.windowStringFormatted.sections, s => s.__typename == 'ViewFormattedStringSection');
    if (!section) {
        throw new Error("Section not found; code need adjustment to accomodate IC payload");
    }

    const group = find(data.getServiceOptions.serviceOptionGroupings, g => g.serviceOptionIds.includes(serviceOptionId))
    if (!group) {
        throw new Error("Group not found; code need adjustment to accomodate IC payload");
    }

    return InstacartServiceOption.create(option.id, group.tierType, section.content);
};

export const mapInstacartServiceOption = (data: InstacartGetServiceOptions): InstacartServiceOptions => {
    const serviceOptions = map(
        data.getServiceOptions.serviceOptions,
        option => mapServiceOption(data, option.id)
    );

    return new InstacartServiceOptions(serviceOptions);
};