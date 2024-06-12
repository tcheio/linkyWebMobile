import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const PrivacyPolicy = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Politique de Confidentialité</Text>
      <Text style={styles.lastUpdated}>Dernière mise à jour : [Date]</Text>
      <Text style={styles.paragraph}>
        Cette Politique de Confidentialité décrit comment [Nom de l'entreprise] (« nous », « notre », « nos ») recueille, utilise et partage les informations que vous fournissez lorsque vous utilisez notre site web [URL du site]. Nous prenons la protection de vos informations personnelles très au sérieux et nous nous engageons à respecter votre vie privée.
      </Text>
      <Text style={styles.subTitle}>Collecte et Utilisation des Informations</Text>
      <Text style={styles.paragraph}>
        Lorsque vous visitez notre site web, nous pouvons recueillir certaines informations vous concernant, telles que votre adresse IP, le type de navigateur que vous utilisez, les pages que vous consultez et la durée de votre visite. Nous utilisons ces informations pour comprendre comment notre site est utilisé, améliorer son contenu et personnaliser votre expérience en ligne.
      </Text>
      <Text style={styles.paragraph}>
        Si vous choisissez de vous inscrire à notre newsletter ou de créer un compte sur notre site, nous pouvons également recueillir des informations personnelles telles que votre nom, votre adresse e-mail et vos préférences de communication. Ces informations sont utilisées pour vous envoyer des communications marketing et des mises à jour sur nos produits et services, sous réserve de votre consentement préalable.
      </Text>
      <Text style={styles.subTitle}>Partage des Informations</Text>
      <Text style={styles.paragraph}>
        Nous ne vendons pas, ne louons pas et ne divulguons pas vos informations personnelles à des tiers, sauf dans les cas suivants :
      </Text>
      <Text style={styles.listItem}>
        - Lorsque cela est nécessaire pour fournir un service que vous avez demandé, tel que l'expédition de produits ou la gestion de votre compte utilisateur.
      </Text>
      <Text style={styles.listItem}>
        - Lorsque nous sommes légalement tenus de le faire pour répondre à une exigence légale, protéger nos droits ou ceux d'autrui, ou pour garantir la sécurité de notre site et de nos utilisateurs.
      </Text>
      <Text style={styles.listItem}>
        - Avec votre consentement préalable.
      </Text>
      <Text style={styles.subTitle}>Cookies et Technologies Similaires</Text>
      <Text style={styles.paragraph}>
        Nous utilisons des cookies et d'autres technologies de suivi pour collecter des informations sur votre utilisation de notre site web et pour vous offrir une expérience en ligne personnalisée. Vous pouvez contrôler l'utilisation des cookies dans les paramètres de votre navigateur, mais veuillez noter que certaines fonctionnalités de notre site peuvent ne pas fonctionner correctement si vous désactivez les cookies.
      </Text>
      <Text style={styles.subTitle}>Conservation des Données</Text>
      <Text style={styles.paragraph}>
        Nous conservons vos informations personnelles aussi longtemps que nécessaire pour atteindre les objectifs décrits dans cette Politique de Confidentialité, sauf si une période de conservation plus longue est requise ou permise par la loi.
      </Text>
      <Text style={styles.subTitle}>Vos Droits</Text>
      <Text style={styles.paragraph}>
        Vous avez le droit d'accéder à vos informations personnelles, de les corriger, de les supprimer ou de restreindre leur traitement à tout moment. Vous avez également le droit de vous opposer au traitement de vos informations personnelles à des fins de marketing direct.
      </Text>
      <Text style={styles.subTitle}>Contactez-nous</Text>
      <Text style={styles.paragraph}>
        Si vous avez des questions ou des préoccupations concernant notre Politique de Confidentialité, ou si vous souhaitez exercer vos droits en matière de protection des données, veuillez nous contacter à l'adresse suivante : [Adresse e-mail ou postale].
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  lastUpdated: {
    fontSize: 16,
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 10,
  },
  listItem: {
    fontSize: 16,
    marginLeft: 20,
    marginBottom: 10,
  },
});

export default PrivacyPolicy;