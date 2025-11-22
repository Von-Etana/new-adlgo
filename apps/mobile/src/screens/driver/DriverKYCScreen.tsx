import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    TextInput,
    Image,
} from 'react-native';
import { Bike, Car, Bus, Truck, FileText, Camera, ArrowRight } from 'lucide-react-native';

const STEPS = ['Personal', 'Vehicle', 'Documents', 'Verify'];

const DriverKYCScreen = ({ navigation }: any) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [vehicleType, setVehicleType] = useState('Bike');

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            // Submit and go to Home
            navigation.replace('DriverHome'); // Assuming this route exists in stack
        }
    };

    const renderStepIndicator = () => (
        <View style={styles.stepContainer}>
            {STEPS.map((step, index) => (
                <View key={step} style={styles.stepItem}>
                    <View style={[styles.stepDot, index <= currentStep && styles.activeStepDot]} />
                    <Text style={[styles.stepLabel, index <= currentStep && styles.activeStepLabel]}>
                        {step}
                    </Text>
                </View>
            ))}
        </View>
    );

    const renderPersonalStep = () => (
        <View>
            <Text style={styles.stepTitle}>Personal Details</Text>
            <TextInput style={styles.input} placeholder="Full Name" />
            <TextInput style={styles.input} placeholder="Phone Number" keyboardType="phone-pad" />
            <TextInput style={styles.input} placeholder="Email Address" keyboardType="email-address" />
            <TextInput style={styles.input} placeholder="Home Address" />
        </View>
    );

    const renderVehicleStep = () => (
        <View>
            <Text style={styles.stepTitle}>Vehicle Details</Text>

            <View style={styles.vehicleGrid}>
                {['Bike', 'Car', 'Van', 'Truck'].map((type) => (
                    <TouchableOpacity
                        key={type}
                        style={[styles.vehicleOption, vehicleType === type && styles.activeVehicleOption]}
                        onPress={() => setVehicleType(type)}
                    >
                    >
                        <View style={{ marginBottom: 8 }}>
                            {type === 'Bike' ? <Bike size={32} color={vehicleType === type ? '#000' : '#666'} /> :
                                type === 'Car' ? <Car size={32} color={vehicleType === type ? '#000' : '#666'} /> :
                                    type === 'Van' ? <Bus size={32} color={vehicleType === type ? '#000' : '#666'} /> :
                                        <Truck size={32} color={vehicleType === type ? '#000' : '#666'} />}
                        </View>
                        <Text style={[styles.vehicleText, vehicleType === type && styles.activeVehicleText]}>
                            {type}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TextInput style={styles.input} placeholder="Vehicle Brand (e.g., Toyota)" />
            <TextInput style={styles.input} placeholder="Model (e.g., Camry)" />
            <TextInput style={styles.input} placeholder="Year (e.g., 2015)" keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Plate Number" autoCapitalize="characters" />
        </View>
    );

    const renderDocumentsStep = () => (
        <View>
            <Text style={styles.stepTitle}>Upload Documents</Text>
            {['Driver\'s License', 'Vehicle Registration', 'Insurance Policy'].map((doc) => (
                <TouchableOpacity key={doc} style={styles.uploadButton}>
                    <View style={styles.uploadIconContainer}>
                        <FileText size={20} color="#1A1A1A" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.uploadLabel}>{doc}</Text>
                        <Text style={styles.uploadSubLabel}>Tap to upload</Text>
                    </View>

                    <ArrowRight size={20} color="#AAA" />
                </TouchableOpacity>
            ))
            }
        </View >
    );

    const renderVerifyStep = () => (
        <View style={styles.verifyContainer}>
            <View style={styles.cameraPlaceholder}>
                <Camera size={48} color="#1A1A1A" />
            </View>
            <Text style={styles.verifyTitle}>Take a Selfie</Text>
            <Text style={styles.verifyText}>
                We need to match your face with your ID card to verify your identity.
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Driver Registration</Text>
            </View>

            {renderStepIndicator()}

            <ScrollView contentContainerStyle={styles.content}>
                {currentStep === 0 && renderPersonalStep()}
                {currentStep === 1 && renderVehicleStep()}
                {currentStep === 2 && renderDocumentsStep()}
                {currentStep === 3 && renderVerifyStep()}
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                    <Text style={styles.nextButtonText}>
                        {currentStep === STEPS.length - 1 ? 'Submit Application' : 'Next Step'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    stepContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        paddingVertical: 20,
    },
    stepItem: {
        alignItems: 'center',
    },
    stepDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#E0E0E0',
        marginBottom: 4,
    },
    activeStepDot: {
        backgroundColor: '#000',
    },
    stepLabel: {
        fontSize: 10,
        color: '#AAA',
    },
    activeStepLabel: {
        color: '#000',
        fontWeight: '600',
    },
    content: {
        padding: 24,
    },
    stepTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 24,
        color: '#1A1A1A',
    },
    input: {
        backgroundColor: '#F8F9FA',
        height: 56,
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    vehicleGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    vehicleOption: {
        width: '48%',
        backgroundColor: '#F8F9FA',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    activeVehicleOption: {
        borderColor: '#000',
        backgroundColor: '#FFF',
    },
    vehicleIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    vehicleText: {
        fontWeight: '600',
        color: '#666',
    },
    activeVehicleText: {
        color: '#000',
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#F8F9FA',
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderStyle: 'dashed',
    },
    uploadIconContainer: {
        width: 40,
        height: 40,
        backgroundColor: '#E3F2FD',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    uploadIcon: {
        fontSize: 20,
    },
    uploadLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    uploadSubLabel: {
        fontSize: 12,
        color: '#888',
    },
    uploadArrow: {
        fontSize: 20,
        color: '#AAA',
    },
    verifyContainer: {
        alignItems: 'center',
        paddingTop: 40,
    },
    cameraPlaceholder: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 2,
        borderColor: '#000',
        borderStyle: 'dashed',
    },
    cameraIcon: {
        fontSize: 48,
    },
    verifyTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    verifyText: {
        textAlign: 'center',
        color: '#666',
        paddingHorizontal: 40,
    },
    footer: {
        padding: 24,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    nextButton: {
        backgroundColor: '#000',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nextButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default DriverKYCScreen;
