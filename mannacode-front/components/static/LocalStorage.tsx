export const getLocalStorage = (tag: string) => {
  if (typeof window !== 'undefined')
    return localStorage.getItem(tag)
  else
    return undefined
}

export abstract class LocalStorageItem {
  public static user = 'user';
  public static token = 'token';
  public static tokenPlayer = 'tokenPlayer';
  public static playerSoloEmail = 'playerSoloEmail';
  public static id = 'id';
  public static room = 'room';
  public static player = 'player';
  public static playerName = 'playerName';
  public static reload = 'reload';
  public static reloadApplicator = 'reloadApplicator';
  public static paletteTheme = 'paletteTheme';
  public static paletteCode = 'paletteCode';
  public static stage = 'stage';
  public static groupChallengeId = 'groupChallengeId';
  public static challengesId = 'challengesId';
  public static routeLogin = 'routeLogin';
  public static key = 'key';
}
