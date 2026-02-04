const { PERMISSIONS, hasPermission } = require('../../src/utils/permissionUtils.js');

describe('API PermissionUtils', () => {
  test('owner should have all permissions', () => {
    Object.values(PERMISSIONS).forEach(perm => {
      expect(hasPermission('owner', perm)).toBe(true);
    });
  });

  test('admin should not have BAND_DELETE', () => {
    expect(hasPermission('admin', PERMISSIONS.BAND_DELETE)).toBe(false);
  });

  test('member should only have view/create song/setlist', () => {
    expect(hasPermission('member', PERMISSIONS.SONG_CREATE)).toBe(true);
    expect(hasPermission('member', PERMISSIONS.SONG_EDIT)).toBe(false);
    expect(hasPermission('member', PERMISSIONS.SETLIST_VIEW)).toBe(true);
    expect(hasPermission('member', PERMISSIONS.SETLIST_EDIT)).toBe(false);
  });
});
