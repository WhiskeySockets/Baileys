export const TargetType = {
    10: 'shot',
    20: 'scene',
    30: 'track',
    40: 'part',
    50: 'album',
    60: 'edition',
    70: 'collection'
};
export const TrackType = {
    video: 0x01,
    audio: 0x02,
    complex: 0x03,
    logo: 0x04,
    subtitle: 0x11,
    button: 0x12,
    control: 0x20
};
export const TrackTypeValueToKeyMap = {
    [TrackType.video]: 'video',
    [TrackType.audio]: 'audio',
    [TrackType.complex]: 'complex',
    [TrackType.logo]: 'logo',
    [TrackType.subtitle]: 'subtitle',
    [TrackType.button]: 'button',
    [TrackType.control]: 'control'
};
