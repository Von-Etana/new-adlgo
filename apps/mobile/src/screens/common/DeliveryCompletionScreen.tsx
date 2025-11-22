import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Image,
    TextInput,
    Alert,
} from 'react-native';
import { Camera, Star } from 'lucide-react-native';

const DeliveryCompletionScreen = ({ navigation, route }: any) => {
    // Determine mode: 'driver' (taking photo) or 'customer' (rating)
    const { mode = 'driver' } = route.params || {};
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [photoUri, setPhotoUri] = useState<string | null>(null);

    const handleTakePhoto = () => {
        // In real app: launchCamera()
        setPhotoUri('https://via.placeholder.com/300x200.png?text=Package+Photo');
    };

    const handleComplete = async () => {
        if (mode === 'driver' && !photoUri) {
            Alert.alert('Proof Required', 'Please take a photo of the delivered package.');
            return;
        }

        try {
            // In a real app, we would call the backend to complete the order
            // await api.post(`/orders/${orderId}/complete`, { photoUri });

            // Simulate API call
            await new Promise(resolve => setTimeout(() => resolve(true), 1000));

            Alert.alert('Success', 'Delivery Completed & Payment Processed!');
            navigation.navigate('Home');
        } catch (error) {
            Alert.alert('Error', 'Failed to complete delivery. Please try again.');
        }
    };

    const renderDriverView = () => (
        <View style={styles.content}>
            <Text style={styles.title}>Proof of Delivery</Text>
            <Text style={styles.subtitle}>Take a clear photo of the package at the dropoff location.</Text>

            <TouchableOpacity style={styles.photoBox} onPress={handleTakePhoto}>
                {photoUri ? (
                    <Image source={{ uri: photoUri }} style={styles.photo} />
                ) : (
                    <View style={styles.cameraPlaceholder}>
                        <Camera size={48} color="#1A1A1A" />
                        <Text style={styles.cameraText}>Tap to take photo</Text>
                    </View>
                )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleComplete}>
                <Text style={styles.buttonText}>Confirm Delivery</Text>
            </TouchableOpacity>
        </View>
    );

    const renderCustomerView = () => (
        <View style={styles.content}>
            <Text style={styles.title}>Rate your Driver</Text>
            <Text style={styles.subtitle}>How was your delivery with Musa?</Text>

            <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity key={star} onPress={() => setRating(star)}>
                        <Star size={48} color={star <= rating ? '#FFC107' : '#E0E0E0'} fill={star <= rating ? '#FFC107' : 'none'} />
                    </TouchableOpacity>
                ))}
            </View>

            <TextInput
                style={styles.input}
                placeholder="Write a review (optional)..."
                multiline
                value={review}
                onChangeText={setReview}
            />

            <TouchableOpacity style={styles.button} onPress={handleComplete}>
                <Text style={styles.buttonText}>Submit Rating</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {mode === 'driver' ? renderDriverView() : renderCustomerView()}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    content: {
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#1A1A1A',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 32,
    },
    photoBox: {
        width: '100%',
        height: 250,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 32,
        borderWidth: 2,
        borderColor: '#E0E0E0',
        borderStyle: 'dashed',
    },
    photo: {
        width: '100%',
        height: '100%',
    },
    cameraPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
    },
    cameraIcon: {
        fontSize: 48,
        marginBottom: 8,
    },
    cameraText: {
        color: '#888',
        fontWeight: '500',
    },
    button: {
        width: '100%',
        backgroundColor: '#000',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    starsContainer: {
        flexDirection: 'row',
        marginBottom: 32,
    },
    star: {
        fontSize: 48,
        color: '#E0E0E0',
        marginHorizontal: 4,
    },
    activeStar: {
        color: '#FFC107',
    },
    input: {
        width: '100%',
        height: 100,
        backgroundColor: '#F5F5F5',
        borderRadius: 16,
        padding: 16,
        marginBottom: 32,
        textAlignVertical: 'top',
        fontSize: 16,
    },
});

export default DeliveryCompletionScreen;
