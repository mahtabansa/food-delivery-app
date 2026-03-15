import React from 'react'
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'
import scooter from '../assets/scooter.png'
import home from '../assets/home.png'
import { MapContainer ,Marker, Polyline } from 'react-leaflet';
import { TileLayer } from 'react-leaflet';
import { Popup } from 'react-leaflet';
const deliveryBoyIcon = new L.icon({
      iconUrl:scooter,
      iconSize:[40 , 40],
      iconAnchor:[20 ,40]
})


const CustomerIcon  = new L.icon({
      iconUrl:home,
      iconSize:[40 , 40],
      iconAnchor:[20 ,40]
})
export const DeliveryBoyTracking = ({data}) => {

      const customerlat = data?.data?.customerLocation?.lat ||  data?.customerLocation?.lat ; 
      const customerlong = data?.data?.customerLocation?.long || data?.customerLocation?.lon;

      const  deliveryBoyLat = data?.data?.deliveryBoyLocation?.lat || data?.deliveryBoyLocation?.lat;
      const  deliveryBoylong = data?.data?.deliveryBoyLocation?.long || data?.deliveryBoyLocation?.lon;

      const path = [
            [deliveryBoyLat ,deliveryBoylong],
            [customerlat ,customerlong]
      ]

      const center = [deliveryBoyLat ,deliveryBoylong]
  return (
      <div className='rounded-lg bg-gray-100 py-2 '>
                                  <div className='h-60 w-full '>
    
                                        <MapContainer center={center} zoom={16} scrollWheelZoom={true} className="h-full w-full rounded-lg map-container">
    
                                              <TileLayer
                                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                              />
                                             
                                              <Marker position={[deliveryBoyLat ,deliveryBoylong]} icon={deliveryBoyIcon} >
                                                    <Popup >
                                                          Delivery Boy 
                                                    </Popup>
                                              </Marker>

                                               <Marker position={[customerlat ,customerlong]} icon={CustomerIcon} >
                                                    <Popup >
                                                         customer
                                                    </Popup>
                                              </Marker>
                                              <Polyline positions={path} color='blue' weight={2}/>
                                        </MapContainer>

                                        
                                  </div>
                            </div>
  )
}
