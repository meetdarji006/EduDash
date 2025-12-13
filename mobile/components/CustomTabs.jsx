import { View, Text, TouchableOpacity } from 'react-native'

const CustomTabs = ({ tabs = [], activeTab, setActiveTab }) => {
    return (
        <View className="bg-slate-50 p-1.5 rounded-2xl flex-row mb-6 border border-slate-100">
            {tabs.map((tab) => {
                const isActive = activeTab === tab;
                return (
                    <TouchableOpacity
                        key={tab}
                        onPress={() => setActiveTab(tab)}
                        activeOpacity={0.7}
                        className={`flex-1 py-3 rounded-xl flex-row items-center justify-center ${isActive ? 'bg-white' : 'bg-transparent'
                            }`}
                    >
                        <Text style={{ fontWeight: 800 }} className={`text-xs ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    )
}

export default CustomTabs
