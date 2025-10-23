'use client';

import {
	APILoadingStatus,
	APIProvider,
	APIProviderContext,
	AdvancedMarker,
	AdvancedMarkerContext,
	ControlPosition,
	Map as DefaultMap,
	GoogleMapsContext,
	InfoWindow,
	MapControl,
	Marker,
	Pin,
	isLatLngLiteral,
	latLngEquals,
	limitTiltRange,
	toLatLngLiteral,
	useAdvancedMarkerRef,
	useApiIsLoaded,
	useApiLoadingStatus,
	useMap,
	useMapsLibrary,
	useMarkerRef,
} from '@vis.gl/react-google-maps';
import { useCallback, useState } from 'react';

const GoogleMap = ({ children, ...rest }) => {
	const [Zoom, setZoom] = useState(rest.zoom);
	const [Center, setCenter] = useState(rest.center);

	const zoom = Zoom ?? rest.zoom;
	const center = Center ?? rest.center;

	const handleZoomChanged = useCallback(
		(event) => {
			rest.onZoomChanged?.(event);

			setZoom(event.detail.zoom);
		},
		[rest.onZoomChanged]
	);

	const handleCenterChanged = useCallback(
		(event) => {
			rest.onCenterChanged?.(event);

			setCenter(event.detail.center);
		},
		[rest.onCenterChanged]
	);

	return (
		<DefaultMap
			{...rest}
			{...(zoom
				? {
						zoom,
						onZoomChanged: handleZoomChanged,
					}
				: {})}
			{...(center
				? {
						center,
						onCenterChanged: handleCenterChanged,
					}
				: {})}
			mapId={rest.mapId ?? 'map'} // shit breaks if we don't set mapId
		>
			{children}
		</DefaultMap>
	);
};

export {
	GoogleMap as Map,
	latLngEquals,
	useMarkerRef,
	useApiIsLoaded,
	useMapsLibrary,
	isLatLngLiteral,
	toLatLngLiteral,
	useApiLoadingStatus,
	useAdvancedMarkerRef,
	limitTiltRange,
	Pin,
	Marker,
	useMap,
	InfoWindow,
	MapControl,
	APIProvider,
	AdvancedMarker,
	ControlPosition,
	APILoadingStatus,
	GoogleMapsContext,
	APIProviderContext,
	AdvancedMarkerContext,
};
