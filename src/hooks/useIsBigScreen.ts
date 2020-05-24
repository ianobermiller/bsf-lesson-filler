import {BIG} from '../styles/MediaQueries';
import useMediaQuery from './useMediaQuery';

export default function useIsBigScreen(): boolean {
  return useMediaQuery(BIG);
}
