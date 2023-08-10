import { Injectable } from '@nestjs/common';
import { FeatureCollection } from 'geojson';
import fetch from 'node-fetch';

@Injectable()
export class PlacesService {
  constructor() {}
  coordinatesToAddress(params: {
    lat: number;
    lng: number;
  }): Promise<{
    display_name: string;
  }> {
    const { lat, lng } = params;
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
    return fetch(url).then(r => r.json());
  }

  addressToCoordinates(params: {
    query: any;
  }): Promise<FeatureCollection<any>> {
    const { query } = params;
    const qParam = new URLSearchParams({
      ...query,
      format: 'geojson',
      countrycodes: 'vn',
      bounded: 1,
    }).toString();
    const url = `https://nominatim.openstreetmap.org/search?${qParam}`;
    return fetch(url).then(r => r.json());
  }

  async findAddress(params: { address: string }) {
    const address = encodeURI(params.address);
    const url = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=${address}&f=json&outSR=4326&outFields=Addr_type%2CMatch_addr%2CStAddr%2CCity&maxLocations=1`;
    const result = await fetch(url).then(r => r.json());
    if (result.candidates.length) {
      return result.candidates[0].location;
    } else return null;
  }
}
