    import React from 'react';
    import { View, StyleSheet } from 'react-native';
    import { XYPlot, XAxis, YAxis, HorizontalGridLines, VerticalBarSeries, DiscreteColorLegend } from 'react-vis';

    const data = [
    { date: "2024-04-11", kw: 11682 },
    { date: "2024-04-10", kw: 11218 },
    { date: "2024-04-09", kw: 16225 },
    { date: "2024-04-08", kw: 15599 },
    { date: "2024-04-07", kw: 12942 },
    { date: "2024-04-06", kw: 11225 },
    { date: "2024-04-05", kw: 11275 }
    ];

    function Global() {
    // Convertir les dates au format JavaScript Date
    const formattedData = data.map(item => ({ x: new Date(item.date), y: item.kw }));

    // Obtenir les dates uniques
    const uniqueDates = [...new Set(formattedData.map(item => item.x))];

    // Créer un tableau de barres avec les coordonnées x ajustées pour chaque date
    const barSeries = uniqueDates.map(date => {
        const barsForDate = formattedData.filter(item => item.x.getTime() === date.getTime());
        const totalBars = barsForDate.length;
        return barsForDate.map((item, index) => ({
        x: item.x.getTime() + (index - (totalBars - 1) / 2) * 1000 * 60 * 60 * 24, // Ajustement de la position de la barre
        y: item.y
        }));
    }).flat(); // Aplatir le tableau de barres

    // Obtenir les valeurs de kW uniques
    const uniqueKwValues = data.map(item => item.kw);

    return (
        <View style={styles.container}>
        
        <XYPlot height={500} width={500}>
            <HorizontalGridLines />
            <VerticalBarSeries data={barSeries} barWidth={0.3} />
            <XAxis tickValues={uniqueDates} tickFormat={d => `${d.getDate()}/${d.getMonth() + 1}`} />
            <YAxis/>
        </XYPlot>
        </View>
    );
    }

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    });

    export default Global;
