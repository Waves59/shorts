export interface PaywallProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
  isLoading?: boolean;
}
