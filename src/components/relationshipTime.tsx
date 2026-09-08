import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getRelationshipTime } from '../utils/dateUtils';

interface RelationshipTimeProps {
    startDate: Date;
}

export default function RelationshipTime({
    startDate,
}: RelationshipTimeProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const relationshipTime = getRelationshipTime(
        startDate,
        currentDate,
    );

    const years = relationshipTime.years ?? 0;
    const months = relationshipTime.months ?? 0;
    const days = relationshipTime.days ?? 0;
    const hours = relationshipTime.hours ?? 0;
    const minutes = relationshipTime.minutes ?? 0;
    const seconds = relationshipTime.seconds ?? 0;

    return (
        <View style={styles.card}>
            <Text style={styles.title}>
                Estamos juntos há
            </Text>

            {years > 0 && (
                <Text style={styles.counter}>
                    {years} anos
                </Text>
            )}

            {months > 0 && (
                <Text style={styles.counter}>
                    {months} meses
                </Text>
            )}

            {days > 0 && (
                <Text style={styles.counter}>
                    {days} dias
                </Text>
            )}

            {(hours > 0 || minutes > 0 || seconds > 0) && (
                <Text style={styles.time}>
                    {hours > 0 && `${hours}h `}
                    {minutes > 0 && `${minutes}m `}
                    {seconds > 0 && `${seconds}s`}
                </Text>
            )}

            <Text style={styles.date}>
                Desde {format(startDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '100%',
        backgroundColor: '#1c1c1c',
        borderRadius: 20,
        padding: 24,
    },
    title: {
        color: 'white',
        fontSize: 19,
        fontWeight: '900',
        marginBottom: 22,
    },
    counter: {
        fontSize: 28,
        fontWeight: '600',
        color: 'white',
        textAlign: 'center',
    },
    time: {
        fontSize: 18,
        color: '#bdbdbd',
        marginTop: 12,
        textAlign: 'center',
    },
    date: {
        fontSize: 14,
        color: '#686868',
        marginTop: 16,
        textAlign: 'center',
    },
});