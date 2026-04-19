/**
 * Shared store for donators list
 * Used to check if a username is a donator for feature gating
 */

let donatorsList = $state<string[]>([]);
let refreshCount = $state(0);

export const donatorsStore = {
    get list() { return donatorsList; },
    get refreshCount() { return refreshCount; },

    /**
     * Set the list of donator usernames
     */
    set(names: string[]) {
        donatorsList = names;
    },

    /**
     * Trigger a refresh of all components depending on donators data
     */
    refresh() {
        refreshCount++;
    },

    /**
     * Check if a username is a donator (case-sensitive)
     */
    isDonator(username: string): boolean {
        if (!username) return false;
        return donatorsList.includes(username);
    }
};
