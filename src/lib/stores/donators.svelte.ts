/**
 * Shared store for donators list
 * Used to check if a username is a donator for feature gating
 */

let donatorsList = $state<string[]>([]);

export const donatorsStore = {
    get list() { return donatorsList; },

    /**
     * Set the list of donator usernames
     */
    set(names: string[]) {
        donatorsList = names;
    },

    /**
     * Check if a username is a donator (case-sensitive)
     */
    isDonator(username: string): boolean {
        if (!username) return false;
        return donatorsList.includes(username);
    }
};
