import type { providers } from 'ethers';
import type { LodgingFacilityRecord } from '../store/actions';
import type { TokenAttribute } from 'stays-core';
import { useState, useCallback } from 'react';
import { Box, Grid, Text } from 'grommet';
import { Modal } from '../components/Modal';
import QRCode from 'react-qr-code';
import { useSignVoucher } from '../hooks/useSignVoucher';
import Logger from '../utils/logger';
import styled from 'styled-components';
import { DateTime } from 'luxon';
import { utils, BigNumber as BN } from 'ethers';
import { CustomButton } from './SearchResultCard';

// Initialize logger
const logger = Logger('StayVoucherQr');

export const Title = styled(Text)`
  color: #0D0E0F;
  font-weight: 900;
  font-size: 28px;
  line-height: 32px;
  // margin-bottom: .5rem;
`;

const Price = styled(Text)`
  color: #0D0E0F;
  font-weight: 900;
  font-size: 28px;
  line-height: 32px;
  margin-top: .5rem;
`;

const HotelTitle = styled(Text)`
  color: #0D0E0F;
  font-weight: 900;
  font-size: 22px;
  line-height: 28px;
  margin-bottom: .5rem;
  margin-top: 1.5rem;
`;

export const CustomText = styled(Text)`
  color: #0D0E0F;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 24px;
  text-align: start;
  // text-justify: center;
`;

export interface StayVoucherQrProps {
  provider?: providers.JsonRpcProvider,
  from: string | undefined,
  to: string | undefined,
  tokenId: string,
  onError: (error: string) => void
  name: string;
  description: string;
  attributes?: TokenAttribute[];
  facility?: LodgingFacilityRecord;
  getDate?: (days: number) => DateTime;
  pricePerNightWei?: string;
}

export const StayVoucherQr = ({
  provider,
  from,
  to,
  tokenId,
  onError,
  name,
  description,
  attributes,
  facility,
  getDate
}: StayVoucherQrProps) => {
  const [signCallback, isSignerReady] = useSignVoucher(provider);
  const [qrData, setQrData] = useState<string | undefined>();

  const downloadQr = (qrId: string): void => {
    const xml = (document as any).getElementById(qrId).outerHTML;
    const data = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;
    const downloadElem = document.createElement('a');
    downloadElem.setAttribute('href', data);
    downloadElem.setAttribute('download', 'StaysVoucherQr.svg');
    downloadElem.click();
  }

  const handleGetQr = useCallback(
    async () => {
      try {
        if (!from) {
          throw new Error('Signer account is not connected yet');
        }

        if (!to) {
          throw new Error('Stay voucher recipient not defined');
        }

        const voucher = await signCallback(
          from,
          to,
          tokenId
        );

        setQrData(JSON.stringify(voucher));
      } catch (err) {
        logger.error(err);
        const message = (err as Error).message ||
          'Unknown QrTest error'
        onError(message);
      }
    },
    [signCallback, onError, from, to, tokenId]
  );

  const parseTrait = useCallback(
    (trait: string): any => {
      return (attributes || []).find(attr => attr.trait_type === trait)?.value ?? ''
    },
    [attributes]
  );

  const space = facility?.spaces.find(space => space.contractData.spaceId === parseTrait('spaceId').toLowerCase())
  const quantity = Number(parseTrait('quantity'))
  const numberOfDays = Number(parseTrait('numberOfDays'))
  const total = BN.from(space?.contractData.pricePerNightWei || 0).mul(BN.from(numberOfDays)).mul(BN.from(quantity)).toString();
  const totalEther = utils.formatUnits(total, 'ether');

  if (!isSignerReady || !getDate) {
    return null;
  }

  return (
    <Box>
      <CustomButton
        label='Get check-in QR'
        onClick={handleGetQr}
      />

      <Modal
        show={!!qrData && typeof qrData === 'string'}
        onClose={() => setQrData(undefined)}
      >
        {typeof qrData === 'string' &&
          <Grid
            height='33rem'
            pad='large'
            gap='1rem'
            columns={['17rem', '16rem']}
            rows={['16rem', '16em']}
            areas={[
              { name: 'label', start: [0, 0], end: [0, 1] },
              { name: 'qr', start: [1, 0], end: [1, 0] },
              { name: 'hotel-data', start: [0, 1], end: [1, 1] },
            ]}
          >
            <Box
              gridArea='label'
              direction='column'
              align='start'
            >
              <Title style={{ marginBottom: '.5rem' }}>You stay is booked and is now an NFT.</Title>
              <CustomText>Please take a picture or download the QR code as it will be used for you to check-in at the property.</CustomText>
              <CustomButton
                label='Download QR'
                margin={{ top: '1.5rem' }}
                onClick={() => downloadQr(qrData.substring(0, 10))}
              />
            </Box>
            <Box
              gridArea='qr'
            >
              <QRCode
                size={256}
                id={qrData.substring(0, 10)}
                value={qrData}
              />
            </Box>
            <Box
              gridArea='hotel-data'
              border='top'
            >
              <HotelTitle>{facility?.name}</HotelTitle>
              <CustomText>{getDate(parseTrait('startDay')).toFormat('MM.dd.yyyy')} - {getDate(Number(parseTrait('startDay')) + Number(parseTrait('numberOfDays'))).toFormat('MM.dd.yyyy')}</CustomText>
              <CustomText>{facility?.type}, {quantity} {quantity === 1 ? 'room' : 'rooms'}</CustomText>
              <Price>{totalEther} xDAI</Price>
            </Box>
          </Grid>
        }
      </Modal>
    </Box>
  );
};
