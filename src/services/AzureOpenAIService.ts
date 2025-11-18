export interface CredibilityAnalysis {
    score: number;
    assessment: "CREDIBLE" | "DOUTEUX" | "INCERTAIN";
    explanation: string;
}

export interface ConfidenceAnalysis {
    score: number;
    level: "ELEVE" | "MOYEN" | "FAIBLE";
}

export interface ToxicityAnalysis {
    score: number;
    level: "AUCUNE" | "FAIBLE" | "MODEREE" | "ELEVEE";
    types: string[];
}

export interface SentimentAnalysis {
    primary: string;
    intensity: number;
    emotions: string[];
}

export interface CompleteAnalysis {
    credibility: CredibilityAnalysis;
    confidence: ConfidenceAnalysis;
    toxicity: ToxicityAnalysis;
    sentiment: SentimentAnalysis;
    suggestedResponse: string;
}

export class AzureOpenAIService {
    /**
     * Analyse un message Twitter via Azure OpenAI (version mockée)
     * @param message Le message à analyser
     * @returns Promise avec l'analyse complète
     */
    async analyzeMessage(message: string): Promise<CompleteAnalysis> {
        // Simulation d'un délai d'API Azure OpenAI
        await this.delay(1500);

        // Analyse basée sur des caractéristiques simples du message
        const messageLength = message.length;
        const hasQuestionMark = message.includes("?");
        const hasExclamation = message.includes("!");
        const hasUpperCase = message !== message.toLowerCase();
        const wordCount = message.split(/\s+/).length;

        return {
            credibility: this.analyzeCredibility(messageLength, wordCount),
            confidence: this.analyzeConfidence(messageLength, hasQuestionMark),
            toxicity: this.analyzeToxicity(hasExclamation, hasUpperCase, message),
            sentiment: this.analyzeSentiment(hasQuestionMark, hasExclamation, message),
            suggestedResponse: this.generateSuggestedResponse(message),
        };
    }

    /**
     * Modifie le ton d'une réponse suggérée via Azure OpenAI (version mockée)
     * @param originalResponse La réponse originale
     * @param tone Le ton demandé
     * @returns Promise avec la réponse modifiée
     */
    async modifyResponseTone(originalResponse: string, tone: string): Promise<string> {
        // Simulation d'un délai d'API Azure OpenAI
        await this.delay(1000);

        const responses: Record<string, string> = {
            "plus formel":
                "Nous vous remercions pour votre communication. Votre retour a été dûment pris en considération et fera l'objet d'une attention particulière de notre part. Nous restons à votre disposition pour tout complément d'information.",
            "plus humoristique":
                "Merci pour ce super message ! 😊 On adore votre énergie et on est partants pour continuer cette conversation endiablée ! Vous nous avez vraiment fait sourire avec ça !",
            "plus empathique":
                "Merci beaucoup pour votre message, cela nous touche vraiment. Nous comprenons parfaitement votre point de vue et vos préoccupations. Nous sommes là pour vous écouter et vous accompagner dans cette démarche.",
            "plus concis": "Merci pour votre message ! Nous prenons note et vous recontacterons rapidement.",
            "plus détaillé":
                "Nous vous remercions sincèrement pour votre message et le temps précieux que vous avez pris pour nous écrire. Votre retour est extrêmement important pour nous car il nous permet d'améliorer continuellement nos services et de mieux comprendre les attentes et les besoins de notre communauté. Nous avons bien noté tous les points que vous avez soulevés et nous serons ravis de poursuivre cet échange enrichissant avec vous afin d'approfondir les sujets qui vous intéressent.",
        };

        return responses[tone] || originalResponse;
    }

    /**
     * Simule un délai d'API Azure OpenAI
     */
    private delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    /**
     * Analyse la crédibilité du message via Azure OpenAI (mockée)
     */
    private analyzeCredibility(messageLength: number, wordCount: number): CredibilityAnalysis {
        let score = 50; // Score de base

        // Plus le message est long et structuré, plus il semble crédible
        if (messageLength > 100) score += 20;
        if (messageLength > 200) score += 15;
        if (wordCount > 20) score += 10;

        // Limitation du score maximum
        score = Math.min(95, score);

        let assessment: "CREDIBLE" | "DOUTEUX" | "INCERTAIN";
        if (score >= 80) assessment = "CREDIBLE";
        else if (score >= 50) assessment = "INCERTAIN";
        else assessment = "DOUTEUX";

        const explanation = this.getCredibilityExplanation(score, messageLength);

        return { score, assessment, explanation };
    }

    /**
     * Analyse le niveau de confiance via Azure OpenAI (mockée)
     */
    private analyzeConfidence(messageLength: number, hasQuestionMark: boolean): ConfidenceAnalysis {
        let score = 70; // Score de base

        if (messageLength > 50) score += 10;
        if (hasQuestionMark) score -= 15; // Les questions réduisent la confiance

        score = Math.max(10, Math.min(95, score));

        let level: "ELEVE" | "MOYEN" | "FAIBLE";
        if (score >= 75) level = "ELEVE";
        else if (score >= 45) level = "MOYEN";
        else level = "FAIBLE";

        return { score, level };
    }

    /**
     * Analyse la toxicité du message via Azure OpenAI (mockée)
     */
    private analyzeToxicity(hasExclamation: boolean, hasUpperCase: boolean, message: string): ToxicityAnalysis {
        let score = 5; // Score de base très faible
        const types: string[] = [];

        if (hasExclamation) {
            score += 15;
            types.push("emphase forte");
        }

        if (hasUpperCase && message === message.toUpperCase()) {
            score += 25;
            types.push("cris");
        }

        // Détection de mots potentiellement agressifs (simulation simple)
        const aggressiveWords = ["stupide", "idiot", "nul", "horrible"];
        if (aggressiveWords.some((word) => message.toLowerCase().includes(word))) {
            score += 30;
            types.push("langage agressif");
        }

        score = Math.max(0, Math.min(100, score));

        let level: "AUCUNE" | "FAIBLE" | "MODEREE" | "ELEVEE";
        if (score <= 10) level = "AUCUNE";
        else if (score <= 30) level = "FAIBLE";
        else if (score <= 60) level = "MODEREE";
        else level = "ELEVEE";

        return { score, level, types };
    }

    /**
     * Analyse le sentiment du message via Azure OpenAI (mockée)
     */
    private analyzeSentiment(hasQuestionMark: boolean, hasExclamation: boolean, message: string): SentimentAnalysis {
        let primary = "NEUTRE";
        let intensity = 50;
        const emotions: string[] = [];

        if (hasQuestionMark) {
            primary = "INTERROGATIF";
            intensity = 68;
            emotions.push("curiosité", "intérêt");
        } else if (hasExclamation) {
            primary = "ENTHOUSIASTE";
            intensity = 75;
            emotions.push("joie", "enthousiasme");
        } else {
            // Détection de mots positifs/négatifs (simulation simple)
            const positiveWords = ["merci", "super", "génial", "parfait", "excellent"];
            const negativeWords = ["problème", "erreur", "bug", "mauvais", "décevant"];

            const hasPositive = positiveWords.some((word) => message.toLowerCase().includes(word));
            const hasNegative = negativeWords.some((word) => message.toLowerCase().includes(word));

            if (hasPositive) {
                primary = "POSITIF";
                intensity = 80;
                emotions.push("satisfaction", "joie");
            } else if (hasNegative) {
                primary = "NÉGATIF";
                intensity = 70;
                emotions.push("frustration", "déception");
            } else {
                primary = "AMICAL";
                intensity = 65;
                emotions.push("cordialité");
            }
        }

        return { primary, intensity, emotions };
    }

    /**
     * Génère une réponse suggérée via Azure OpenAI (mockée)
     */
    private generateSuggestedResponse(message: string): string {
        const hasQuestionMark = message.includes("?");
        const hasComplaint = ["problème", "erreur", "bug"].some((word) => message.toLowerCase().includes(word));

        if (hasQuestionMark) {
            return "Merci pour votre question ! Nous allons examiner cela attentivement et vous répondre dans les plus brefs délais avec toutes les informations nécessaires.";
        } else if (hasComplaint) {
            return "Nous vous remercions de nous avoir signalé ce problème. Nous prenons votre retour très au sérieux et notre équipe technique va investiguer rapidement pour apporter une solution.";
        } else {
            return "Merci pour votre message ! Nous apprécions votre retour constructif et serons ravis d'échanger davantage sur ce sujet.";
        }
    }

    /**
     * Génère une explication pour le score de crédibilité
     */
    private getCredibilityExplanation(score: number, messageLength: number): string {
        if (score >= 80) {
            return "Le message contient des informations vérifiables et cohérentes avec un style rédactionnel approprié.";
        } else if (score >= 50) {
            return "Le message présente quelques éléments crédibles mais nécessite une vérification approfondie.";
        } else {
            return `Le message est trop court (${messageLength} caractères) ou manque d'éléments factuels pour établir sa crédibilité.`;
        }
    }

    /**
     * Liste des tons disponibles pour modifier une réponse
     */
    getAvailableTones(): string[] {
        return ["plus formel", "plus humoristique", "plus empathique", "plus concis", "plus détaillé"];
    }
}

// Export d'une instance singleton
export const azureOpenAIService = new AzureOpenAIService();
