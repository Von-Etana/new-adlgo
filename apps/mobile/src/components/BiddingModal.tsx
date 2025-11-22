import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Image,
} from 'react-native';

// Types
interface OrderRequest {
    id: string;
    pickup: string;
    dropoff: string;
    price: number;
    distance: string;
    type: 'Express' | 'Standard';
}

interface BiddingModalProps {
    visible: boolean;
    request: OrderRequest;
    onAccept: (price: number) => void;
    onBid: (price: number) => void;
    onDecline: () => void;
}

const BiddingModal: React.FC<BiddingModalProps> = ({
    visible,
    request,
    onAccept,
    onBid,
    onDecline,
}) => {
    if (!visible) return null;

    const [customBid, setCustomBid] = useState<number | null>(null);

    // Calculate suggested bids
    const bidOption1 = Math.round(request.price * 1.1); // +10%
    const bidOption2 = Math.round(request.price * 1.2); // +20%

    return (
        <View style={styles.overlay}>
            <View style={styles.card}>
                {/* Header / Timer Bar */}
                <View style={styles.header}>
                    <View style={styles.timerBar}>
                        <View style={styles.timerProgress} />
                    </View>
                    <Text style={styles.timeText}>15s left</Text>
                </View>

                {/* Route Info */}
                <View style={styles.routeContainer}>
                    <View style={styles.routeRow}>
                        <View style={[styles.dot, styles.greenDot]} />
                        <Text style={styles.addressText} numberOfLines={1}>
                            {request.pickup}
                        </Text>
                    </View>
                    <View style={styles.verticalLine} />
                    <View style={styles.routeRow}>
                        <View style={[styles.dot, styles.redDot]} />
                        <Text style={styles.addressText} numberOfLines={1}>
                            {request.dropoff}
                        </Text>
                    </View>
                </View>

                {/* Price & Type */}
                <View style={styles.detailsContainer}>
                    <View>
                        <Text style={styles.label}>Offer Price</Text>
                        <Text style={styles.price}>₦{request.price.toLocaleString()}</Text>
                    </View>
                    <View style={styles.tag}>
                        <Text style={styles.tagText}>{request.type}</Text>
                    </View>
                    <View>
                        <Text style={styles.label}>Distance</Text>
                        <Text style={styles.distance}>{request.distance}</Text>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionsContainer}>
                    <TouchableOpacity
                        style={[styles.button, styles.acceptButton]}
                        onPress={() => onAccept(request.price)}
                    >
                        <Text style={styles.buttonText}>Accept ₦{request.price}</Text>
                    </TouchableOpacity>
                </View>

                {/* Counter Bids */}
                <View style={styles.bidOptionsContainer}>
                    <TouchableOpacity
                        style={[styles.bidButton]}
                        onPress={() => onBid(bidOption1)}
                    >
                        <Text style={styles.bidText}>Bid ₦{bidOption1}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.bidButton]}
                        onPress={() => onBid(bidOption2)}
                    >
                        <Text style={styles.bidText}>Bid ₦{bidOption2}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.bidButton, styles.declineButton]}
                        onPress={onDecline}
                    >
                        <Text style={[styles.bidText, styles.declineText]}>Decline</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 1000,
    },
    card: {
        width: width * 0.95,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    timerBar: {
        flex: 1,
        height: 4,
        backgroundColor: '#F0F0F0',
        borderRadius: 2,
        marginRight: 10,
        overflow: 'hidden',
    },
    timerProgress: {
        width: '60%', // Dynamic in real app
        height: '100%',
        backgroundColor: '#FFC107', // Amber for urgency
    },
    timeText: {
        fontSize: 12,
        color: '#888',
        fontWeight: '600',
    },
    routeContainer: {
        marginBottom: 20,
    },
    routeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    greenDot: {
        backgroundColor: '#4CAF50',
    },
    redDot: {
        backgroundColor: '#F44336',
    },
    verticalLine: {
        width: 2,
        height: 15,
        backgroundColor: '#E0E0E0',
        marginLeft: 4,
    },
    addressText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    detailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
        paddingHorizontal: 5,
    },
    label: {
        fontSize: 12,
        color: '#888',
        marginBottom: 4,
    },
    price: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
    },
    distance: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    tag: {
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    tagText: {
        color: '#2196F3',
        fontWeight: '700',
        fontSize: 12,
    },
    actionsContainer: {
        marginBottom: 10,
    },
    button: {
        height: 50,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    acceptButton: {
        backgroundColor: '#000000', // Primary Black
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    bidOptionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    bidButton: {
        flex: 1,
        height: 40,
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 4,
    },
    bidText: {
        color: '#333',
        fontWeight: '600',
        fontSize: 14,
    },
    declineButton: {
        backgroundColor: '#FFEBEE',
    },
    declineText: {
        color: '#D32F2F'
    }
});

export default BiddingModal;
