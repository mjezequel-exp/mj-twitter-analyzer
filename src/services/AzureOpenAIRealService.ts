import { settings } from "@/settings";

/**
 * Interface pour l'analyse d'un message
 */
export interface MessageAnalysis {
    credibility: {
        score: number;
        assessment: string;
        explanation: string;
    };
    confidence: {
        score: number;
        level: string;
    };
    toxicity: {
        score: number;
        level: string;
        types: string[];
    };
    sentiment: {
        primary: string;
        intensity: number;
        emotions: string[];
    };
    suggestedResponse: string;
}

/**
 * Type alias pour la compatibilité avec l'ancien service
 */
export type CompleteAnalysis = MessageAnalysis;

/**
 * Service pour interagir avec Azure OpenAI
 */
class AzureOpenAIRealService {
    private endpoint: string;
    private apiKey: string;
    private deployment: string;
    private apiVersion: string;

    constructor() {
        this.endpoint = settings.azureOpenAI.endpoint;
        this.apiKey = settings.azureOpenAI.apiKey;
        this.deployment = settings.azureOpenAI.deployment;
        this.apiVersion = settings.azureOpenAI.apiVersion;

        // Vérification que toutes les config sont présentes
        if (!this.endpoint || !this.apiKey || !this.deployment) {
            console.error("❌ Configuration Azure OpenAI manquante !");
            console.error({
                endpoint: this.endpoint ? "✓" : "✗",
                apiKey: this.apiKey ? "✓" : "✗",
                deployment: this.deployment ? "✓" : "✗",
            });
        } else {
            console.log("✅ Configuration Azure OpenAI chargée :");
            console.log({
                endpoint: this.endpoint,
                deployment: this.deployment,
                apiVersion: this.apiVersion,
            });
        }
    }

    /**
     * Construit l'URL complète pour l'API Azure OpenAI
     */
    private getApiUrl(): string {
        // Format Azure : {endpoint}/openai/deployments/{deployment}/chat/completions?api-version={version}
        const url = `${this.endpoint}/openai/deployments/${this.deployment}/chat/completions?api-version=${this.apiVersion}`;
        console.log("🔗 URL API:", url);
        return url;
    }

    /**
     * Test la connectivité avec Azure OpenAI
     */
    async testConnection(): Promise<{ success: boolean; error?: string; suggestions?: string[] }> {
        console.log("🧪 Test de connectivité Azure OpenAI...");

        try {
            const response = await fetch(this.getApiUrl(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "api-key": this.apiKey,
                },
                body: JSON.stringify({
                    messages: [{ role: "user", content: "Test" }],
                    max_tokens: 10,
                }),
            });

            if (response.ok) {
                return { success: true };
            }

            const errorData = await response.json();
            const suggestions = [];

            if (errorData.error?.code === "DeploymentNotFound") {
                suggestions.push(
                    "Vérifiez le nom du déploiement dans Azure Portal",
                    "Noms courants : 'gpt-4', 'gpt-35-turbo', 'gpt-4o', 'gpt-4-turbo'",
                    "Assurez-vous que le déploiement est dans l'état 'Succeeded'",
                );
            }

            return {
                success: false,
                error: errorData.error?.message || "Erreur inconnue",
                suggestions,
            };
        } catch (error) {
            return {
                success: false,
                error: `Erreur de connexion: ${error instanceof Error ? error.message : String(error)}`,
            };
        }
    }

    /**
     * Analyse un message Twitter
     */
    async analyzeMessage(message: string): Promise<MessageAnalysis> {
        console.log("📤 Envoi de l'analyse pour:", message.substring(0, 50) + "...");

        try {
            const response = await fetch(this.getApiUrl(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "api-key": this.apiKey, // Azure utilise 'api-key' et non 'Authorization'
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: "system",
                            content: "Tu es un assistant expert en analyse de contenu des réseaux sociaux. Tu réponds UNIQUEMENT en JSON valide, sans texte avant ou après.",
                        },
                        {
                            role: "user",
                            content: `Analyse ce message Twitter et retourne un JSON avec cette structure exacte :

{
  "credibility": {
    "score": <nombre entre 0 et 100>,
    "assessment": "CREDIBLE | DOUTEUX | FAKE_NEWS",
    "explanation": "explication courte"
  },
  "confidence": {
    "score": <nombre entre 0 et 100>,
    "level": "TRES_FAIBLE | FAIBLE | MOYEN | ELEVE | TRES_ELEVE"
  },
  "toxicity": {
    "score": <nombre entre 0 et 100>,
    "level": "AUCUNE | FAIBLE | MODEREE | ELEVEE | EXTREME",
    "types": ["violence", "moquerie", "insulte", "harcèlement", etc.]
  },
  "sentiment": {
    "primary": "AMICAL | NEUTRE | HOSTILE | SARCASTIQUE | INTERROGATIF",
    "intensity": <nombre entre 0 et 100>,
    "emotions": ["colère", "joie", "tristesse", "peur", etc.]
  },
  "suggestedResponse": "réponse professionnelle et polie"
}

Message à analyser: "${message}"`,
                        },
                    ],
                    temperature: 0.7,
                    max_tokens: 1500,
                }),
            });

            console.log("📥 Réponse reçue, status:", response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error("❌ Erreur API:", errorData);

                // Gestion spéciale pour l'erreur de déploiement
                if (errorData.error?.code === "DeploymentNotFound") {
                    console.error("🔍 DIAGNOSTIC - Déploiement non trouvé !");
                    console.error(`   Endpoint: ${this.endpoint}`);
                    console.error(`   Deployment: ${this.deployment}`);
                    console.error(`   URL complète: ${this.getApiUrl()}`);
                    console.error("💡 Solutions possibles :");
                    console.error("   1. Vérifier le nom du déploiement dans Azure Portal");
                    console.error("   2. Le déploiement doit être 'Completed' (pas en cours)");
                    console.error("   3. Vérifier que l'endpoint est correct");
                    console.error("   4. Noms de déploiement courants : 'gpt-4', 'gpt-35-turbo', 'gpt-4o'");
                }

                throw new Error(`Erreur Azure OpenAI (${errorData.error?.code}): ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            console.log("✅ Données brutes:", data);

            // Azure OpenAI retourne la réponse dans choices[0].message.content
            const content = data.choices[0].message.content;

            // Nettoyer le JSON (enlever les balises markdown si présentes)
            const cleanContent = content
                .replace(/```json\n?/g, "")
                .replace(/```\n?/g, "")
                .trim();

            console.log("🧹 Contenu nettoyé:", cleanContent);

            const result = JSON.parse(cleanContent);
            console.log("✨ Analyse complète:", result);

            return result;
        } catch (error) {
            console.error("💥 Erreur lors de l'analyse:", error);
            throw error;
        }
    }

    /**
     * Retourne la liste des tons disponibles
     */
    getAvailableTones(): string[] {
        return ["Professionnel", "Amical", "Détendu", "Formel", "Empathique", "Humoristique", "Assertif", "Diplomate"];
    }

    /**
     * Modifie le ton d'une réponse (version avec 2 paramètres pour compatibilité)
     */
    async modifyResponseTone(originalResponse: string, tone: string): Promise<string>;
    /**
     * Modifie le ton d'une réponse (version avec 3 paramètres complète)
     */
    async modifyResponseTone(originalResponse: string, originalMessage: string, tone: string): Promise<string>;
    /**
     * Modifie le ton d'une réponse
     */
    async modifyResponseTone(originalResponse: string, param2: string, param3?: string): Promise<string> {
        // Déterminer si on a 2 ou 3 paramètres
        const tone = param3 ? param3 : param2;
        const originalMessage = param3 ? param2 : "";

        console.log(`🎨 Modification du ton vers: ${tone}`);

        try {
            const response = await fetch(this.getApiUrl(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "api-key": this.apiKey,
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: "user",
                            content: `Réécris cette réponse avec un ton ${tone}.

Réponse originale: "${originalResponse}"
Message original: "${originalMessage}"

Retourne UNIQUEMENT le texte de la nouvelle réponse, sans préambule ni explication.`,
                        },
                    ],
                    temperature: 0.8,
                    max_tokens: 800,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Erreur Azure OpenAI: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            const newResponse = data.choices[0].message.content.trim();

            console.log("✅ Nouvelle réponse:", newResponse);
            return newResponse;
        } catch (error) {
            console.error("💥 Erreur lors de la modification:", error);
            throw error;
        }
    }

    /**
     * Méthode de diagnostic pour aider au troubleshooting
     */
    getDiagnosticInfo(): {
        endpoint: string;
        deployment: string;
        apiVersion: string;
        fullUrl: string;
        hasApiKey: boolean;
    } {
        return {
            endpoint: this.endpoint,
            deployment: this.deployment,
            apiVersion: this.apiVersion,
            fullUrl: this.getApiUrl(),
            hasApiKey: !!this.apiKey,
        };
    }
}

// Export d'une instance unique (Singleton)
export const azureOpenAIRealService = new AzureOpenAIRealService();
