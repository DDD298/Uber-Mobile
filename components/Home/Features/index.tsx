import { AntDesign, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { FlatList, Text, View } from 'react-native';

interface FeatureItem {
    id: string;
    title: string;
    description: string;
    icon: {
        name: string;
        size: number;
        color: string;
        library: 'AntDesign' | 'FontAwesome5' | 'Ionicons';
    };
}

const featuresData: FeatureItem[] = [
    {
        id: '1',
        title: 'Đánh giá tài xế',
        description: 'Chia sẻ trải nghiệm của bạn',
        icon: {
            name: 'star',
            size: 24,
            color: 'white',
            library: 'AntDesign'
        }
    },
    {
        id: '2',
        title: 'Thanh toán linh hoạt',
        description: 'Tiền mặt, thẻ, ví điện tử',
        icon: {
            name: 'credit-card',
            size: 20,
            color: 'white',
            library: 'FontAwesome5'
        }
    },
    {
        id: '3',
        title: 'Hỗ trợ 24/7',
        description: 'Luôn sẵn sàng hỗ trợ bạn',
        icon: {
            name: 'headset',
            size: 24,
            color: 'white',
            library: 'Ionicons'
        }
    }
];

const renderIcon = (icon: FeatureItem['icon']) => {
    const iconProps = {
        name: icon.name as any,
        size: icon.size,
        color: icon.color
    };

    switch (icon.library) {
        case 'AntDesign':
            return <AntDesign {...iconProps} />;
        case 'FontAwesome5':
            return <FontAwesome5 {...iconProps} />;
        case 'Ionicons':
            return <Ionicons {...iconProps} />;
        default:
            return <AntDesign {...iconProps} />;
    }
};

const FeatureItem = ({ item }: { item: FeatureItem }) => (
    <View className='p-4 mb-4 rounded-xl bg-white/20'>
        <View className='flex-row items-center'>
            <View className='justify-center items-center mr-3 w-12 h-12 rounded-full bg-white/20'>
                {renderIcon(item.icon)}
            </View>
            <View className='flex-1 pl-3 border-l border-l-white/20'>
                <Text className='text-lg text-white font-JakartaBold'>{item.title}</Text>
                <Text className='text-sm text-white/80'>{item.description}</Text>
            </View>
            <View
                className='w-12 h-12 bg-green-600 rounded-full'
                style={{
                    transform: [{ translateX: 36 }]
                }}
            />
        </View>
    </View>
);

export default function Features() {
    const renderFeatureItem = ({ item }: { item: FeatureItem }) => (
        <FeatureItem item={item} />
    );

    return (
        <View>
            <Text className='mb-4 text-xl text-white font-JakartaBold'>Tính năng</Text>
            <FlatList
                data={featuresData}
                renderItem={renderFeatureItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}
