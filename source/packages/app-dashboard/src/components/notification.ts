import { notification } from 'antd'
import { ArgsProps } from 'antd/es/notification/interface'
import { NotificationType } from '../models'

const DEFAULT_NOTIFICATION_DURATION = 5.5

const defaultNotificationStyle: React.CSSProperties = {
  borderRadius: 10,
}

export function notifyUser(
  description: string,
  notificationType: NotificationType,
  typeName?: string,
  onClose?: () => void,
  duration?: number,
) {
  const defaultNotificationObj: ArgsProps = {
    message: 'No Content',
    description,
    duration: duration ? duration : DEFAULT_NOTIFICATION_DURATION,
    onClose,
    style: defaultNotificationStyle,
  }
  switch (notificationType) {
    case 'Error':
      notification.error({
        ...defaultNotificationObj,
        message: typeName ? `${typeName} Error` : `Error`,
      })
      break
    case 'Success':
      notification.success({
        ...defaultNotificationObj,
        message: typeName ? `${typeName} Success` : `Success`,
      })
      break
    case 'Warn':
      notification.warning({
        ...defaultNotificationObj,
        message: typeName ? `${typeName} Warn` : `Warn`,
      })
      break
    default:
      notification.info({
        ...defaultNotificationObj,
        message: typeName ? `${typeName} Information` : `Information`,
      })
      break
  }
}
