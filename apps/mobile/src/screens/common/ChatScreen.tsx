import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { ArrowLeft, Phone, Plus, Send } from 'lucide-react-native';

const MOCK_MESSAGES = [
    { id: '1', text: 'Hello! I am on my way to the pickup point.', sender: 'driver', time: '10:30 AM' },
    { id: '2', text: 'Okay, please call me when you arrive.', sender: 'user', time: '10:31 AM' },
];

const ChatScreen = ({ navigation, route }: any) => {
    const [messages, setMessages] = useState(MOCK_MESSAGES);
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef<FlatList>(null);

    const handleSend = () => {
        if (!inputText.trim()) return;

        const newMessage = {
            id: Date.now().toString(),
            text: inputText,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, newMessage]);
        setInputText('');

        // Simulate reply
        setTimeout(() => {
            const reply = {
                id: (Date.now() + 1).toString(),
                text: 'Got it!',
                sender: 'driver',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages((prev) => [...prev, reply]);
        }, 1500);
    };

    useEffect(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    const renderItem = ({ item }: { item: any }) => {
        const isUser = item.sender === 'user';
        return (
            <View style={[styles.messageContainer, isUser ? styles.userMessage : styles.driverMessage]}>
                <Text style={[styles.messageText, isUser ? styles.userText : styles.driverText]}>
                    {item.text}
                </Text>
                <Text style={[styles.timeText, isUser ? styles.userTime : styles.driverTime]}>
                    {item.time}
                </Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#333" />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Text style={styles.headerName}>Musa Driver</Text>
                    <Text style={styles.headerStatus}>Online</Text>
                </View>
                <TouchableOpacity style={styles.callButton}>
                    <Phone size={18} color="#4CAF50" />
                </TouchableOpacity>
            </View>

            {/* Chat Area */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
            />

            {/* Input Area */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={styles.inputContainer}>
                    <TouchableOpacity style={styles.attachButton}>
                        <Plus size={24} color="#888" />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message..."
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                        <Send size={16} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    backButton: {
        padding: 8,
        marginRight: 12,
    },
    backText: {
        fontSize: 24,
        color: '#333',
    },
    headerInfo: {
        flex: 1,
    },
    headerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    headerStatus: {
        fontSize: 12,
        color: '#4CAF50',
    },
    callButton: {
        padding: 10,
        backgroundColor: '#E8F5E9',
        borderRadius: 20,
    },
    callIcon: {
        fontSize: 18,
    },
    listContent: {
        padding: 16,
        paddingBottom: 20,
    },
    messageContainer: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
        marginBottom: 12,
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#000',
        borderBottomRightRadius: 4,
    },
    driverMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#FFF',
        borderBottomLeftRadius: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    messageText: {
        fontSize: 16,
        marginBottom: 4,
    },
    userText: {
        color: '#FFF',
    },
    driverText: {
        color: '#333',
    },
    timeText: {
        fontSize: 10,
        alignSelf: 'flex-end',
    },
    userTime: {
        color: 'rgba(255,255,255,0.7)',
    },
    driverTime: {
        color: '#AAA',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    attachButton: {
        padding: 10,
        marginRight: 8,
    },
    attachIcon: {
        fontSize: 24,
        color: '#888',
    },
    input: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        maxHeight: 100,
        fontSize: 16,
    },
    sendButton: {
        padding: 10,
        marginLeft: 8,
        backgroundColor: '#000',
        borderRadius: 20,
    },
    sendIcon: {
        color: '#FFF',
        fontSize: 16,
    },
});

export default ChatScreen;
