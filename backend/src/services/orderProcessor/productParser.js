
class ProductParser {
    static extractAppCategory(productName) {
        const categories = {
			'Life & Happiness': [ 'Life', 'Happiness' ],
			'Livestock': [ 'Livestock' ],
			'Health': [ 'Health' ],
			'Education': [ 'Education' ],
            'Enterprise Funding': [ 'Enterprise', 'Funding' ],
			'Entertainment': [ 'Entertainment' ],
			'Wealth Management': [ 'Wealth', 'Management' ],
        };

        for (const [category, keywords] of Object.entries(categories)) {
            for (const keyword of keywords) {
                if (productName.toLowerCase().includes(keyword.toLowerCase())) {
                    return category;
                }
            }
        }
        return 'Unknown';
    }

    static extractDurationDays(productName) {
        const lowerName = productName.toLowerCase();
		if (lowerName.includes('14') || lowerName.includes('trial')) {
			return 13;
		}
		if (lowerName.includes('quarter') || lowerName.includes('90')) {
			return 90;
		}
		if (lowerName.includes('year') || lowerName.includes('365')) {
			return 364;
		}
		return 30; // Default
    }

    static calculateExpiryDate(days) {
        // Logic: Now + 24h (1 day) + Duration Days
        const date = new Date();
        date.setDate(date.getDate() + 1 + days);
        return date.toISOString();
    }
}

module.exports = ProductParser;
