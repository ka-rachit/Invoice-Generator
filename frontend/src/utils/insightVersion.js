const INSIGHT_VERSION_KEY = "invoiceInsightVersion";
const INSIGHT_CACHE_KEY = "invoiceInsightCache";

export const getInsightVersion = () => {
    return parseInt(localStorage.getItem(INSIGHT_VERSION_KEY) || "0", 10);
};

export const bumpInsightVersion = () => {
    const current = getInsightVersion();
    localStorage.setItem(INSIGHT_VERSION_KEY, String(current + 1));
};

export const getCachedInsights = () => {
    try {
        const raw = localStorage.getItem(INSIGHT_CACHE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
};

export const setCachedInsights = (insights, version) => {
    localStorage.setItem(INSIGHT_CACHE_KEY, JSON.stringify({ insights, version }));
};
