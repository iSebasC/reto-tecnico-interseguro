package apperrors

// HTTPError transporta un código HTTP junto al mensaje de error.
// Permite que el handler decida el status code correcto sin conocer
// los detalles de la capa de infraestructura que generó el error.
type HTTPError struct {
	Code    int
	Message string
}

func (e *HTTPError) Error() string {
	return e.Message
}

// Gateway crea un error 502 Bad Gateway.
// Se usa cuando un servicio externo (API Node.js) no responde o retorna un error.
func Gateway(message string) *HTTPError {
	return &HTTPError{Code: 502, Message: message}
}
