import type { LodgingFacility, Space, SpaceRaw } from 'stays-data-models';
import type { Web3ModalProvider } from '../hooks/useWeb3Modal';
import type { IPFS } from '@windingtree/ipfs-apis';
import type { IProviderInfo } from 'web3modal';
import type { providers } from 'ethers';
import { ThemeMode } from '../components/SwitchThemeMode';
import type { StayToken } from 'stays-core';
import { DateTime } from 'luxon';
export interface GenericStateRecord {
  id: string;
  [key: string]: unknown;
}

export interface LodgingFacilityRecord extends GenericStateRecord, LodgingFacility {}
export interface SpaceRecord extends Space, GenericStateRecord {
  available?: number | null;
}

export interface OwnerSpace extends SpaceRaw {
  spaceId: string;
  tokens: StayToken[];
}
export interface OwnerLodgingFacility extends Omit<LodgingFacility, 'spaces'> {
  spaces: OwnerSpace[]
}

export interface SearchParams {
  // timestamp: number;
  startDay: number;
  numberOfDays: number;
  roomsNumber: number;
}

export interface State {
  isConnecting: boolean;
  networkId?: number;
  isRightNetwork: boolean;
  provider?: Web3ModalProvider;
  injectedProvider?: IProviderInfo;
  rpcProvider?: providers.JsonRpcProvider;
  account?: string;
  signIn: Function;
  signOut: Function;
  errors: string[];
  themeMode: ThemeMode;
  ipfsNode?: IPFS;
  isIpfsNodeConnecting: boolean;
  startIpfsNode: Function;
  stopIpfsNode: Function;
  isBootstrapLoading: boolean;
  bootstrapped?: number;
  bootstrappedContract?: string;
  searchTimestamp?: number;
  lodgingFacilities: LodgingFacilityRecord[];
  ownFacilities?: OwnerLodgingFacility[];
  ownFacilitiesLoading?: boolean;
  ownFacilitiesBootstrapped?: boolean;
  ownFacilitiesRefresh?: Function;
  searchSpaces: SpaceRecord[];
  searchParams?: SearchParams;
  getDate?: (days: number) => DateTime;
  [key: string]: unknown | GenericStateRecord[];

}

export interface SetConnectingAction {
  type: 'SET_CONNECTING',
  payload: boolean;
}

export interface SetAccountAction {
  type: 'SET_ACCOUNT',
  payload: string | undefined;
}

export interface SetIsRightNetworkAction {
  type: 'SET_IS_RIGHT_NETWORK',
  payload: boolean;
}

export interface SetNetworkIdAction {
  type: 'SET_NETWORK_ID',
  payload: number | undefined;
}

export interface SetProviderAction {
  type: 'SET_PROVIDER',
  payload: Web3ModalProvider | undefined;
}

export interface SetInjectedProviderAction {
  type: 'SET_INJECTED_PROVIDER',
  payload: IProviderInfo | undefined;
}

export interface SetRpcProviderAction {
  type: 'SET_RPC_PROVIDER',
  payload: providers.JsonRpcProvider | undefined;
}

export interface SetWeb3modalFunctionsAction {
  type: 'SET_WEB3MODAL_FUNCTIONS',
  payload: {
    signIn: Function;
    signOut: Function;
  }
}

export interface AddErrorAction {
  type: 'ERROR_ADD';
  payload: string;
}

export interface RemoveErrorAction {
  type: 'ERROR_REMOVE';
  payload: number;
}

export interface RemoveAllErrorsAction {
  type: 'ERROR_REMOVE_ALL';
  payload: number;
}

export interface SetThemeModeAction {
  type: 'SET_THEME_MODE';
  payload: ThemeMode;
}

export interface SetIpfsNodeConnectingAction {
  type: 'SET_IPFS_NODE_CONNECTING';
  payload: boolean;
}

export interface SetIpfsNodeAction {
  type: 'SET_IPFS_NODE';
  payload: {
    ipfsNode: IPFS | undefined;
    startIpfsNode: Function;
    stopIpfsNode: Function;
  }
}

export interface SetRecordAction {
  type: 'SET_RECORD';
  payload: {
    name: string;
    record: GenericStateRecord;
  }
}

export interface RemoveRecordAction {
  type: 'REMOVE_RECORD';
  payload: {
    name: string;
    id: string;
  }
}

export interface ResetRecordAction {
  type: 'RESET_RECORD';
  payload: {
    name: string;
  }
}

export interface SetBootstrapLoadingAction {
  type: 'SET_BOOTSTRAP_LOADING';
  payload: boolean;
}

export interface SetBootstrappedAction {
  type: 'SET_BOOTSTRAPPED';
  payload: number;
}

export interface SetBootstrappedContractAction {
  type: 'SET_BOOTSTRAPPED_CONTRACT';
  payload: string;
}

export interface SetAvailabilityTimestampAction {
  type: 'SET_AVAILABILITY_TIMESTAMP';
  payload: number;
}

export interface SetSearchParamsAction {
  type: 'SET_SEARCH_PARAMS';
  payload: SearchParams;
}

export interface SetOwnFacilitiesAction {
  type: 'SET_OWN_FACILITIES';
  payload: OwnerLodgingFacility[];
}

export interface SetOwnFacilitiesRefreshAction {
  type: 'SET_OWN_FACILITIES_REFRESH';
  payload: Function;
}

export interface SetOwnFacilitiesLoadingAction {
  type: 'SET_OWN_FACILITIES_LOADING';
  payload: boolean;
}

export interface SetOwnFacilitiesBootstrappedAction {
  type: 'RESET_OWN_FACILITIES';
}

export interface SetGetDateAction {
  type: 'SET_GET_DATE',
  payload?: (days: number) => DateTime
}

export type Action =
  | SetConnectingAction
  | SetAccountAction
  | SetIsRightNetworkAction
  | SetNetworkIdAction
  | SetThemeModeAction
  | SetProviderAction
  | SetInjectedProviderAction
  | SetRpcProviderAction
  | SetWeb3modalFunctionsAction
  | SetIpfsNodeConnectingAction
  | SetIpfsNodeAction
  | SetRecordAction
  | RemoveRecordAction
  | ResetRecordAction
  | SetBootstrappedAction
  | SetBootstrappedContractAction
  | SetBootstrapLoadingAction
  | SetOwnFacilitiesAction
  | SetOwnFacilitiesRefreshAction
  | SetOwnFacilitiesLoadingAction
  | SetOwnFacilitiesBootstrappedAction
  | SetGetDateAction
  | SetAvailabilityTimestampAction
  | SetSearchParamsAction
  | AddErrorAction
  | RemoveErrorAction
  | RemoveAllErrorsAction;
