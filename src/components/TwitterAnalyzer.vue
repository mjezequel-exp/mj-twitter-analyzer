<script setup lang="ts">
import { useMsal } from "@/composables/useMsal";
import { azureOpenAIRealService, type CompleteAnalysis } from "@/services/AzureOpenAIRealService";

import { useQuasar } from "quasar";
import { ref } from "vue";

const $q = useQuasar();
const { isAuthenticated, accounts, login, logout } = useMsal();

const message = ref("");
const loading = ref(false);
const analysis = ref<CompleteAnalysis | null>(null);
const responseLoading = ref(false);
const currentTone = ref("");

// Liste des tons disponibles (récupérée du service)
const tones = azureOpenAIRealService.getAvailableTones();

/**
 * Analyse le message en utilisant le service
 */
const analyzeMessage = async () => {
    if (!message.value.trim()) {
        $q.notify({
            type: "warning",
            message: "Veuillez entrer un message à analyser",
            position: "top",
        });
        return;
    }

    loading.value = true;
    analysis.value = null;

    try {
        analysis.value = await azureOpenAIRealService.analyzeMessage(message.value);

        $q.notify({
            type: "positive",
            message: "Analyse terminée avec succès !",
            position: "top",
            icon: "check_circle",
        });
    } catch (error) {
        console.error("Erreur lors de l'analyse:", error);
        $q.notify({
            type: "negative",
            message: "Erreur lors de l'analyse du message",
            position: "top",
            icon: "error",
        });
    } finally {
        loading.value = false;
    }
};

/**
 * Modifie le ton de la réponse en utilisant le service
 */
const modifyTone = async (tone: string) => {
    if (!analysis.value?.suggestedResponse) return;

    responseLoading.value = true;
    currentTone.value = tone;

    try {
        const modifiedResponse = await azureOpenAIRealService.modifyResponseTone(analysis.value.suggestedResponse, tone);

        if (analysis.value) {
            analysis.value.suggestedResponse = modifiedResponse;
        }

        $q.notify({
            type: "positive",
            message: `Ton modifié : ${tone}`,
            position: "top",
            icon: "palette",
        });
    } catch (error) {
        console.error("Erreur lors de la modification du ton:", error);
        $q.notify({
            type: "negative",
            message: "Erreur lors de la modification du ton",
            position: "top",
            icon: "error",
        });
    } finally {
        responseLoading.value = false;
        currentTone.value = "";
    }
};

/**
 * Retourne la couleur Quasar selon le score
 */
const getScoreColor = (score: number): string => {
    if (score >= 70) return "positive";
    if (score >= 40) return "warning";
    return "negative";
};

/**
 * Retourne la couleur de la toxicité (inversé)
 */
const getToxicityColor = (score: number): string => {
    if (score <= 30) return "positive";
    if (score <= 60) return "warning";
    return "negative";
};

/**
 * Reset l'analyse
 */
const resetAnalysis = () => {
    message.value = "";
    analysis.value = null;
    $q.notify({
        type: "info",
        message: "Formulaire réinitialisé",
        position: "top",
    });
};
</script>

<template>
    <div class="twitter-analyzer-container">
        <div class="twitter-analyzer-content">
            <!-- Header d'authentification -->
            <q-card class="q-pa-md q-mb-md" flat>
                <div class="row items-center justify-between">
                    <div class="text-h4 text-grey-8 text-weight-bold row items-center">
                        <q-icon name="home" class="q-mr-md" />
                        <span class="gt-sm sr-only">Analyseur de Messages Twitter</span>
                    </div>
                    <div v-if="isAuthenticated" class="row items-center q-gutter-md">
                        <div class="text-body2 text-grey-8">Bonjour {{ accounts[0].name }}</div>
                        <q-btn @click="logout()" outline color="primary" label="Déconnexion" icon="logout" no-caps size="sm" />
                    </div>
                    <div v-else>
                        <q-btn @click="login()" color="white" text-color="primary" label="Se connecter" icon="login" no-caps size="sm" />
                    </div>
                </div>
            </q-card>

            <!-- Contenu principal (affiché seulement si authentifié) -->
            <div v-if="isAuthenticated">
                <!-- Carte de saisie du message -->
                <q-card class="q-pa-xl q-mb-md">
                    <div class="row items-center q-mb-md">
                        <q-icon name="chat" color="blue" size="24px" class="q-mr-md" />
                        <div class="text-h5 text-weight-bold text-grey-8">Message à analyser</div>
                    </div>

                    <q-input
                        v-model="message"
                        type="textarea"
                        outlined
                        placeholder="Collez ici le message Twitter à analyser..."
                        :rows="6"
                        class="q-mb-md"
                        bg-color="grey-1"
                        :disable="loading || !!analysis"
                    />

                    <q-btn
                        v-if="!analysis"
                        @click="analyzeMessage"
                        :loading="loading"
                        :disable="!message.trim()"
                        color="primary"
                        size="lg"
                        class="full-width"
                        icon="send"
                        label="Analyser le message"
                        no-caps
                        style="height: 60px; font-size: 16px"
                    >
                        <template v-slot:loading>
                            <q-spinner-hourglass class="q-mr-sm" />
                            Analyse en cours...
                        </template>
                    </q-btn>
                </q-card>

                <!-- Carte des résultats de l'analyse (affichée seulement après analyse) -->
                <transition appear enter-active-class="animated fade-in" leave-active-class="animated fade-out">
                    <q-card v-if="analysis" class="q-pa-xl">
                        <div class="text-h5 text-weight-bold q-mb-md text-left text-grey-8">📊 Résultats de l'analyse</div>
                        <!-- Métriques -->
                        <div class="column q-gutter-lg q-mb-md">
                            <!-- Crédibilité -->
                            <q-card class="metric-card-full" flat bordered>
                                <q-card-section class="q-pa-lg">
                                    <div class="row items-start">
                                        <div class="col-auto q-mr-lg">
                                            <q-icon name="shield" color="blue" size="32px" />
                                        </div>
                                        <div class="col">
                                            <div class="text-h5 text-weight-medium text-grey-8 q-mb-sm">Crédibilité</div>
                                            <div class="display-1 text-weight-bold q-mb-sm" style="font-size: 32px" :class="`text-${getScoreColor(analysis.credibility.score)}`">
                                                {{ analysis.credibility.score }}%
                                            </div>
                                            <q-badge
                                                :color="getScoreColor(analysis.credibility.score)"
                                                class="text-weight-bold text-body1 q-px-md q-py-xs q-mb-md text-uppercase rounded-borders"
                                                style="border-radius: 24px"
                                            >
                                                {{ analysis.credibility.assessment }}
                                            </q-badge>
                                            <!-- <q-linear-progress :value="analysis.credibility.score / 100" :color="getScoreColor(analysis.credibility.score)" size="8px" rounded class="q-mt-md" /> -->
                                            <div class="text-body1 text-grey-7">
                                                {{ analysis.credibility.explanation }}
                                            </div>
                                        </div>
                                    </div>
                                </q-card-section>
                            </q-card>

                            <!-- Confiance -->
                            <q-card class="metric-card-full" flat bordered>
                                <q-card-section class="q-pa-lg">
                                    <div class="row items-start">
                                        <div class="col-auto q-mr-lg">
                                            <q-icon name="verified" color="purple" size="32px" />
                                        </div>
                                        <div class="col">
                                            <div class="text-h5 text-weight-medium text-grey-8 q-mb-sm">Confiance</div>
                                            <div class="display-1 text-weight-bold q-mb-sm" style="font-size: 32px" :class="`text-${getScoreColor(analysis.confidence.score)}`">
                                                {{ analysis.confidence.score }}%
                                            </div>
                                            <q-badge
                                                :color="getScoreColor(analysis.confidence.score)"
                                                class="text-weight-bold text-body1 q-px-md q-py-xs q-mb-md text-uppercase"
                                                style="border-radius: 24px"
                                            >
                                                {{ analysis.confidence.level }}
                                            </q-badge>
                                            <!-- <q-linear-progress :value="analysis.confidence.score / 100" :color="getScoreColor(analysis.confidence.score)" size="8px" rounded class="q-mt-md" /> -->
                                        </div>
                                    </div>
                                </q-card-section>
                            </q-card>

                            <!-- Toxicité -->
                            <q-card class="metric-card-full" flat bordered>
                                <q-card-section class="q-pa-lg">
                                    <div class="row items-start">
                                        <div class="col-auto q-mr-lg">
                                            <q-icon name="warning" color="red" size="32px" />
                                        </div>
                                        <div class="col">
                                            <div class="text-h5 text-weight-medium text-grey-8 q-mb-sm">Toxicité</div>
                                            <div class="display-1 text-weight-bold q-mb-sm" style="font-size: 32px" :class="`text-${getToxicityColor(analysis.toxicity.score)}`">
                                                {{ analysis.toxicity.score }}%
                                            </div>
                                            <q-badge
                                                :color="getToxicityColor(analysis.toxicity.score)"
                                                class="text-weight-bold text-body1 q-px-md q-py-xs q-mb-md text-uppercase"
                                                style="border-radius: 24px"
                                            >
                                                {{ analysis.toxicity.level }}
                                            </q-badge>
                                            <div v-if="analysis.toxicity.types.length > 0" class="q-mt-md">
                                                <div class="q-gutter-xs">
                                                    <q-chip v-for="(type, index) in analysis.toxicity.types" :key="index" size="md" color="red-2" text-color="red-8" dense>
                                                        {{ type }}
                                                    </q-chip>
                                                </div>
                                            </div>
                                            <!-- <q-linear-progress :value="analysis.toxicity.score / 100" :color="getToxicityColor(analysis.toxicity.score)" size="8px" rounded class="q-mt-md" /> -->
                                        </div>
                                    </div>
                                </q-card-section>
                            </q-card>

                            <!-- Sentiment -->
                            <q-card class="metric-card-full" flat bordered>
                                <q-card-section class="q-pa-lg">
                                    <div class="row items-start">
                                        <div class="col-auto q-mr-lg">
                                            <q-icon name="sentiment_satisfied" color="pink" size="32px" />
                                        </div>
                                        <div class="col">
                                            <div class="text-h5 text-weight-medium text-grey-8 q-mb-sm">Sentiment</div>
                                            <div class="display-2 text-weight-bold text-grey-9 q-mb-sm" style="font-size: 24px">
                                                {{ analysis.sentiment.primary }}
                                            </div>
                                            <div class="text-body1 text-grey-6 q-mb-md">Intensité</div>
                                            <q-linear-progress :value="analysis.sentiment.intensity / 100" color="pink" size="8px" rounded class="q-mb-md" />
                                            <div v-if="analysis.sentiment.emotions.length > 0" class="q-mt-md">
                                                <div class="q-gutter-xs" size="24px">
                                                    <q-chip v-for="(emotion, index) in analysis.sentiment.emotions" :key="index" size="md" color="pink-2" text-color="pink-8" dense>
                                                        {{ emotion }}
                                                    </q-chip>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </q-card-section>
                            </q-card>
                        </div>
                    </q-card>
                </transition>

                <!-- Carte pour la réponse suggérée -->
                <transition appear enter-active-class="animated fade-in" leave-active-class="animated fade-out">
                    <q-card v-if="analysis" flat bordered class="q-pa-xl q-mt-md">
                        <div class="text-h5 text-weight-bold q-mb-md text-left text-grey-8">💬 Réponse suggérée</div>

                        <div class="text-body1 text-grey-7 q-mb-lg q-pa-lg bg-grey-1 rounded-borders" style="font-style: italic">"{{ analysis.suggestedResponse }}"</div>

                        <!-- Boutons de modification du ton -->
                        <div class="text-caption text-grey-7 q-mb-sm text-uppercase">Modifier le ton :</div>
                        <div class="row q-gutter-sm">
                            <q-btn
                                v-for="tone in tones"
                                :key="tone"
                                @click="modifyTone(tone)"
                                :loading="responseLoading && currentTone === tone"
                                size="md"
                                outline
                                color="primary"
                                :label="tone"
                                no-caps
                                class="q-px-md"
                            />
                        </div>
                        <!-- Bouton de nouvelle analyse -->
                        <div class="text-center q-mt-xl">
                            <q-btn @click="resetAnalysis" color="primary" label="Nouvelle analyse" icon="refresh" no-caps size="lg" class="q-px-xl" />
                        </div>
                    </q-card>
                </transition>
            </div>
            <!-- Fin du contenu authentifié -->

            <!-- Message pour utilisateurs non authentifiés -->
            <div v-else>
                <q-card class="q-pa-xl text-center">
                    <q-icon name="lock" size="64px" color="grey-5" class="q-mb-md" />
                    <div class="text-h5 text-grey-7 q-mb-md">Authentification requise</div>
                    <div class="text-body1 text-grey-6 q-mb-xl">Veuillez vous connecter pour accéder à l'analyseur de messages Twitter.</div>
                    <q-btn @click="login()" color="primary" label="Se connecter avec Microsoft" icon="login" no-caps size="lg" class="q-px-xl" />
                </q-card>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.animated-card {
    animation: slide-in-up 0.4s ease-out;
}

.metric-card-full {
    width: calc(100% - 24px);
    transition: all 0.3s ease;
}

.metric-card-full:hover {
    box-shadow: 0 8px 24px rgb(0 0 0 / 12%);
    transform: translateY(-2px);
}

@keyframes slide-in-up {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

// Animation pour les transitions
.animated.fade-in {
    animation-duration: 0.5s;
}

.animated.fade-out {
    animation-duration: 0.3s;
}

.twitter-analyzer-container {
    box-sizing: border-box;
    width: 100%;
    min-height: 100vh;
    padding: 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.twitter-analyzer-content {
    box-sizing: border-box;
    width: 100%;
}
</style>
