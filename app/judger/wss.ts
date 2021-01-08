
export const createWSS = () => {
  const mmp = new Map<number, WebSocket[]>();
  const nmd = new Map<number, string[]>();

  const register = (rid: number, ws: WebSocket) => {
    if (!mmp.has(rid)) {
      mmp.set(rid, [ ws ]);
    } else {
      mmp.get(rid)?.push(ws);
    }

    nmd.get(rid)?.map((data) => {
      ws.send(data);
    });
  }

  const unregister = (rid: number, ws: WebSocket) => {
    const res = mmp.get(rid)?.filter((w) => w !== ws);
    if (res) {
      mmp.set(rid, res);
    }
  }

  const emit = (rid: number, data: string) => {
    mmp.get(rid)?.map((ws) => {
      ws.send(data);
    });

    if (!nmd.has(rid)) {
      nmd.set(rid, [ data ]);
    } else {
      nmd.get(rid)?.push(data);
    }
  }

  const clear = (rid: number) => {
    nmd.delete(rid);
  }

  return {
    emit,
    clear,
    register,
    unregister,
  }
}

export type WSS = ReturnType<typeof createWSS>;
