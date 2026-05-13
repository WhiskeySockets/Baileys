export type PassiveModeIqTag = 'passive' | 'active'

export const getPassiveModeIqTag = (markOnlineOnConnect: boolean): PassiveModeIqTag =>
	markOnlineOnConnect ? 'active' : 'passive'
