import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import { createClient } from 'npm:@supabase/supabase-js@2.112.4';

const supabaseUrl =
    Deno.env.get('SUPABASE_URL')!;

const supabaseServiceRoleKey =
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const geminiApiKey =
    Deno.env.get('GEMINI_API_KEY')!;

const supabase = createClient(
    supabaseUrl,
    supabaseServiceRoleKey,
);

const geminiModel =
    'gemini-3.6-flash';

const timezone =
    'America/Sao_Paulo';

function getLocalDateParts(date: Date) {
    const parts =
        new Intl.DateTimeFormat(
            'en-US',
            {
                timeZone: timezone,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            },
        ).formatToParts(date);

    return {
        year: Number(
            parts.find(
                (part) =>
                    part.type === 'year',
            )?.value,
        ),
        month: Number(
            parts.find(
                (part) =>
                    part.type === 'month',
            )?.value,
        ),
        day: Number(
            parts.find(
                (part) =>
                    part.type === 'day',
            )?.value,
        ),
    };
}

function getDateString(date: Date) {
    const {
        year,
        month,
        day,
    } = getLocalDateParts(date);

    return [
        year,
        String(month).padStart(2, '0'),
        String(day).padStart(2, '0'),
    ].join('-');
}

function getRelationshipMonths(
    startDate: Date,
    currentDate: Date,
) {
    const start =
        getLocalDateParts(
            startDate,
        );

    const current =
        getLocalDateParts(
            currentDate,
        );

    let months =
        (current.year -
            start.year) *
            12 +
        (current.month -
            start.month);

    if (
        current.day <
        start.day
    ) {
        months--;
    }

    return Math.max(
        months,
        0,
    );
}

function getMilestoneDescription(
    startDate: Date,
    currentDate: Date,
) {
    const start =
        getLocalDateParts(
            startDate,
        );

    const current =
        getLocalDateParts(
            currentDate,
        );

    const totalMonths =
        getRelationshipMonths(
            startDate,
            currentDate,
        );

    const isMonthlyMilestone =
        current.day ===
            start.day &&
        totalMonths > 0;

    if (!isMonthlyMilestone) {
        return 'Hoje não é um marco mensal ou anual.';
    }

    if (
        totalMonths % 12 ===
        0
    ) {
        const years =
            totalMonths / 12;

        return `Hoje vocês completam ${years} ${
            years === 1
                ? 'ano'
                : 'anos'
        } juntos.`;
    }

    return `Hoje vocês completam ${totalMonths} ${
        totalMonths === 1
            ? 'mês'
            : 'meses'
    } juntos.`;
}

function cleanReflection(
    content: string,
) {
    return content
        .replace(/\r?\n/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(
            /^["'“”]+|["'“”]+$/g,
            '',
        )
        .trim();
}

function validateReflection(
    content: string,
) {
    const normalizedContent =
        cleanReflection(
            content,
        );

    const characterCount =
        normalizedContent.length;

    const wordCount =
        normalizedContent
            .split(/\s+/)
            .filter(Boolean)
            .length;

    const sentenceCount =
        normalizedContent
            .split(
                /[.!?]+/,
            )
            .filter(
                (sentence) =>
                    sentence.trim()
                        .length > 0,
            )
            .length;

    return {
        isValid:
            characterCount >= 45 &&
            characterCount <= 180 &&
            wordCount >= 8 &&
            wordCount <= 30 &&
            sentenceCount === 1,

        characterCount,
        wordCount,
        sentenceCount,
        normalizedContent,
    };
}

function extractReflection(
    responseData: any,
) {
    const steps =
        Array.isArray(
            responseData?.steps,
        )
            ? responseData.steps
            : [];

    for (
        const step of steps
    ) {
        if (
            step?.type !==
                'model_output' ||
            !Array.isArray(
                step?.content,
            )
        ) {
            continue;
        }

        for (
            const item of
                step.content
        ) {
            if (
                item?.type !==
                    'text' ||
                typeof item?.text !==
                    'string'
            ) {
                continue;
            }

            return item.text;
        }
    }

    const outputText =
        responseData?.output_text;

    if (
        typeof outputText ===
        'string'
    ) {
        return outputText;
    }

    return '';
}

async function requestGemini(
    systemInstruction: string,
    input: string,
) {
    const response =
        await fetch(
            'https://generativelanguage.googleapis.com/v1beta/interactions',
            {
                method: 'POST',
                headers: {
                    'Content-Type':
                        'application/json',
                    'x-goog-api-key':
                        geminiApiKey,
                },
                body: JSON.stringify({
                    model:
                        geminiModel,

                    system_instruction:
                        systemInstruction,

                    input,

                    generation_config: {
                        thinking_level:
                            'minimal',
                        max_output_tokens:
                            256,
                    },

                    store: false,
                }),
            },
        );

    const responseText =
        await response.text();

    let responseData: any;

    try {
        responseData =
            JSON.parse(
                responseText,
            );
    } catch {
        responseData = {
            raw: responseText,
        };
    }

    return {
        status:
            response.status,

        ok:
            response.ok,

        data:
            responseData,
    };
}

async function generateReflection(
    startDate: Date,
    currentDate: Date,
) {
    const currentDateString =
        getDateString(
            currentDate,
        );

    const totalMonths =
        getRelationshipMonths(
            startDate,
            currentDate,
        );

    const milestone =
        getMilestoneDescription(
            startDate,
            currentDate,
        );

    const systemInstruction = `
Você é Tock, a inteligência artificial
do aplicativo Hemi.

Sua função é escrever a "Reflexão amorosa do dia"
para um casal.

A reflexão deve ser CURTA, IMPACTANTE,
romântica e natural.

REGRAS:
- escreva exatamente 1 frase;
- entre 45 e 180 caracteres;
- entre 8 e 30 palavras;
- escreva em português do Brasil;
- tenha uma ideia completa;
- seja romântica sem ser exageradamente melosa;
- tenha personalidade;
- evite clichês excessivos;
- fale sobre amor, parceria, cumplicidade,
  carinho, presença ou crescimento juntos;
- não use emojis;
- não use aspas;
- não escreva título;
- não escreva explicações;
- não diga que é uma IA;
- nunca responda apenas "O amor";
- nunca responda apenas "Amar é";
- nunca responda com poucas palavras;
- retorne SOMENTE a frase.

Exemplo do estilo:
Que cada dia que passe faça o amor crescer,
a parceria se fortalecer e a vontade de caminhar juntos aumentar.
    `.trim();

    const input = `
Data de hoje:
${currentDateString}

Data de início do relacionamento:
${getDateString(startDate)}

Meses completos de relacionamento:
${totalMonths}

Marco de hoje:
${milestone}

Escreva agora uma única reflexão
curta e marcante.
    `.trim();

    const geminiResponse =
        await requestGemini(
            systemInstruction,
            input,
        );

    console.log(
        'Gemini response:',
        JSON.stringify(
            geminiResponse.data,
        ),
    );

    if (
        !geminiResponse.ok
    ) {
        throw new Error(
            `Gemini API error ${geminiResponse.status}: ${JSON.stringify(
                geminiResponse.data,
            )}`,
        );
    }

    const content =
        cleanReflection(
            extractReflection(
                geminiResponse.data,
            ),
        );

    const validation =
        validateReflection(
            content,
        );

    console.log(
        'Tock content:',
        content,
    );

    console.log(
        'Tock validation:',
        JSON.stringify(
            validation,
        ),
    );

    return {
        content,
        validation,
        reflectionDate:
            currentDateString,
        rawResponse:
            geminiResponse.data,
    };
}

export default {
    async fetch() {
        try {
            const now =
                new Date();

            const {
                data: relationship,
                error:
                    relationshipError,
            } =
                await supabase
                    .from(
                        'relationships',
                    )
                    .select(
                        'start_date',
                    )
                    .single();

            if (
                relationshipError
            ) {
                throw relationshipError;
            }

            const startDate =
                new Date(
                    relationship.start_date,
                );

            const result =
                await generateReflection(
                    startDate,
                    now,
                );

            if (
                !result.validation
                    .isValid
            ) {
                return Response.json(
                    {
                        success:
                            false,

                        error:
                            'O Gemini retornou uma reflexão inválida.',

                        content:
                            result.content,

                        validation:
                            result.validation,

                        rawResponse:
                            result.rawResponse,
                    },
                    {
                        status: 422,
                    },
                );
            }

            const {
                error:
                    deleteError,
            } =
                await supabase
                    .from(
                        'daily_reflection',
                    )
                    .delete()
                    .eq(
                        'id',
                        true,
                    );

            if (
                deleteError
            ) {
                throw deleteError;
            }

            const {
                error:
                    insertError,
            } =
                await supabase
                    .from(
                        'daily_reflection',
                    )
                    .insert({
                        id: true,
                        reflection_date:
                            result.reflectionDate,
                        content:
                            result.content,
                        created_at:
                            new Date().toISOString(),
                    });

            if (
                insertError
            ) {
                throw insertError;
            }

            return Response.json({
                success:
                    true,

                reflectionDate:
                    result.reflectionDate,

                content:
                    result.content,
            });
        } catch (
            error
        ) {
            console.error(
                'Tock error:',
                error,
            );

            return Response.json(
                {
                    success:
                        false,

                    error:
                        error instanceof
                            Error
                            ? error.message
                            : String(
                                  error,
                              ),
                },
                {
                    status: 500,
                },
            );
        }
    },
};