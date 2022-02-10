import { StatusBar } from 'expo-status-bar';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Button,
	ActivityIndicator,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export default function App() {
	const url = 'http://192.168.1.224:5000/api/v1/rides';
	const [msg, setMsg] = useState('Waiting for location permissions...');
	const [location, setLocation] = useState(null);
	const [isRecording, setIsRecording] = useState(false);
	const [isPermissionGranted, setIsPermissionGranted] = useState(false);

	useEffect(() => {
		async function autoLocate() {
			let { status } = await Location.requestForegroundPermissionsAsync();

			if (status !== 'granted') {
				setMsg('Permission to access location was denied');
				return;
			}
			let location = await Location.getCurrentPositionAsync({});
			setLocation(location);

			setMsg('Location Permissions Granted');
			setIsPermissionGranted(true);
		}

		autoLocate();
	}, []);

	let rideArray = [];

	const [ride, setRide] = useState([]);

	useEffect(() => {
		if (isRecording) {
			const timer = setInterval(() => {
				rideArray.push(location);
				let obj = {
					lat: location.coords.latitude,
					lng: location.coords.longitude,
				};
				console.log(obj);
				console.log(`# of coordinates recorded: ${rideArray.length}`);
			}, 500);
			return () => {
				setIsRecording(false);
				clearInterval(timer);
			};
		}
	}, [isRecording]);

	async function fetchRides() {
		try {
			const res = await fetch(url);
			const json = await res.json();

			console.log(json);
			alert('Success!');
		} catch (error) {
			console.log({ success: false, msg: error });
			alert(error);
		}
	}

	return (
		<>
			{/* <View style={styles.title}>
				<Text>Bike About</Text>
			</View> */}
			<View style={styles.container}>
				<StatusBar style="auto" />
				{isPermissionGranted && (
					<View>
						{isRecording ? (
							<TouchableOpacity
								style={styles.button}
								onPress={() => {
									setIsRecording(false);
								}}
							>
								<Text style={styles.text}>Stop</Text>
							</TouchableOpacity>
						) : (
							<TouchableOpacity
								style={styles.button}
								onPress={() => setIsRecording(true)}
							>
								<Text style={styles.text}>Record</Text>
							</TouchableOpacity>
						)}
					</View>
				)}

				<View style={styles.confimation}>
					{!isRecording ? (
						<Text style={styles.text}>{msg}</Text>
					) : (
						<Text style={styles.text}>Recording ride...</Text>
					)}
					{!isPermissionGranted && (
						<ActivityIndicator
							style={{ padding: 10 }}
							color="#bc2b78"
							size="large"
						/>
					)}
				</View>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	confimation: {
		marginTop: 20,
	},
	title: {
		fontSize: 50,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	text: {
		color: '#000',
		fontSize: 18,
	},
	container: {
		flex: 5,
		backgroundColor: '#808197',
		alignItems: 'center',
		justifyContent: 'center',
	},
	button: {
		width: 80,
		height: 80,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 10,
		borderRadius: 40,
		backgroundColor: 'red',
		overflow: 'hidden',
	},
});
