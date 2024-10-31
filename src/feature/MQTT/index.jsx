import React, { useState, useEffect } from 'react'
import { List, ListItem, Typography } from '@mui/material'
import mqtt from 'mqtt'

const MQTTBrokerURL = 'wss://9fa12f6bf0fc457b881bc23bb36e869d.s1.eu.hivemq.cloud:8884/mqtt' // HiveMQ public broker
const topic = 'testtopic/1' // Public topic where data is published
const username = 'lyphuc823'
const password = 'jkljkl'
const options = {
  username,
  password,
  clientId: `jkdqlwn1i23m`, //can be changed for something more specific if you need it
}
const DataList = () => {
  const [dataList, setDataList] = useState([])

  useEffect(() => {
    // Connect to the MQTT broker
    const mqttClient = mqtt.connect(MQTTBrokerURL, options)
    mqttClient.on('connect', () => {
      console.log('Connected to MQTT broker')
      mqttClient.subscribe(topic, (err) => {
        if (err) {
          console.error('Subscription error:', err)
        } else {
          console.log(`Subscribed to topic ${topic}`)
        }
      })
    })

    mqttClient.on('message', (topic, message) => {
      const receivedData = message.toString()
      console.log('Received message:', receivedData)
      // Append new data received from the broker
      setDataList((prevDataList) => [...prevDataList, receivedData])
    })
    mqttClient.on('error', (err) => {
      console.error('MQTT connection error:', err)
    })
    // Cleanup on component unmount
    return () => {
      console.log('Disconnecting from MQTT broker')
      mqttClient.end()
    }
  }, [])

  return (
    <div>
      <Typography variant="h4">MQTT Data List</Typography>
      <List>
        {dataList.map((item, index) => (
          <ListItem key={index}>
            <Typography>{item}</Typography>
          </ListItem>
        ))}
      </List>
    </div>
  )
}

export default DataList
