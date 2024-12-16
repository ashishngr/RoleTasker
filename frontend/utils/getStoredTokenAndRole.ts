import StorageUtils from '../utils/storage_utils';

export const getStoredTokenAndRole = async () => {
    const token = await StorageUtils.getAPIToken();
    const userProfile = await StorageUtils.getUserProfile();
    return { token, role: userProfile?.roles };
};
