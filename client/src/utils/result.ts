export type Result<A, B> =
	| {
			type: "ok"
			data: A
	  }
	| {
			type: "err"
			data: B
	  }

export function Ok<A, B = unknown>(data: A): Result<A, B> {
	return {
		type: "ok",
		data,
	}
}

export function Err<B, A = unknown>(data: B): Result<A, B> {
	return {
		type: "err",
		data,
	}
}
