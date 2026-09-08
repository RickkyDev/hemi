import { Greeting } from '../services/greetingService';

export function getRandomGreeting(
    greetings: Greeting[],
) {
    if (greetings.length === 0) {
        return 'Oi';
    }

    const randomIndex = Math.floor(
        Math.random() * greetings.length,
    );

    const selectedGreeting =
        greetings[randomIndex].greeting;

    if (
        selectedGreeting === 'timeOfDay'
    ) {
        const hour = new Date().getHours();

        if (hour >= 5 && hour < 12) {
            return 'Bom dia';
        }

        if (hour >= 12 && hour < 18) {
            return 'Boa tarde';
        }

        return 'Boa noite';
    }

    return selectedGreeting;
}