// Doesn't work across page navigation

// import {
//    type QueryKey,
//    type UseMutationOptions,
//    type UseMutationResult,
//    type UseSuspenseQueryOptions,
//    type UseSuspenseQueryResult,
//    useMutation,
//    useSuspenseQuery,
// } from "@tanstack/react-query"
// import { useBlocker } from "@tanstack/react-router"
// import { useCallback, useEffect, useMemo, useRef, useState } from "react"
// import { debounce } from "remeda"
// import type { MergeFunc } from "./utils"

// export type AutoSyncSaveStatus =
//    | "loading"
//    | "saving"
//    | "saved"
//    | "unsaved"
//    | "error"

// export type UseAutoSyncDraftProvider<TQueryFnData> = {
//    /**
//     * Function used to update the draft
//     */
//    setDraft: (data: TQueryFnData | undefined) => void
//    /**
//     * The current value of the draft
//     */
//    draft: TQueryFnData | undefined
// }

// /**
//  * Return type of UseAutoSync
//  */
// export type UseAutoSyncResult<
//    TQueryFnData,
//    TQueryError,
//    TMutationData,
//    TMutationError,
//    TMutationContext,
// > = {
//    /**
//     * Function used to manually save the data to the server
//     */
//    save: () => void
//    /**
//     * Function used to update server data. Be careful avoid modifying the draft
//     * directly and instead set the draft to a copy.
//     */
//    setDraft: (data: TQueryFnData | undefined) => void
//    /**
//     * The current value of the data either locally modified or taken from the server.
//     * May be undefined if the data is not yet loaded.
//     */
//    draft: TQueryFnData | undefined
//    /**
//     * The result of `useQuery`
//     */
//    queryResult: UseSuspenseQueryResult<TQueryFnData, TQueryError>
//    /**
//     * The result of `useMutation`
//     */
//    mutationResult: UseMutationResult<
//       TMutationData,
//       TMutationError,
//       TQueryFnData,
//       TMutationContext
//    >
//    /**
//     * The current save status of the query
//     */
//    saveStatus: AutoSyncSaveStatus
// }

// /**
//  * React hook which can be used to automatically save and update query data.
//  */
// export function useAutoSync<
//    TQueryFnData = unknown,
//    TQueryError = unknown,
//    TQueryKey extends QueryKey = QueryKey,
//    TMutationData = unknown,
//    TMutationError = unknown,
//    TMutationContext = unknown,
// >({
//    queryOptions,
//    mutationOptions,
//    autoSaveOptions,
//    merge,
//    alertIfUnsavedChanges = true,
//    mutateEnabled = true,
//    draftProvider = undefined,
// }: {
//    /**
//     * queryOptions passed to `useQuery`
//     */
//    queryOptions: UseSuspenseQueryOptions<
//       TQueryFnData,
//       TQueryError,
//       TQueryFnData,
//       TQueryKey
//    >
//    /**
//     * mutationOptions passed to `useMutation`. Internally the hook uses
//     * `onMutate`, `onError`, and `onSettled` to optimistically update the draft.
//     */
//    mutationOptions: UseMutationOptions<
//       TMutationData,
//       TMutationError,
//       TQueryFnData, // input to mutate is the same as the output of the query
//       TMutationContext
//    >
//    /**
//     * options passed to `lodash.debounce` to automatically save the query data to
//     * the server with a debounced save function.  if undefined the hook will not
//     * automatically save data to the server.
//     */
//    autoSaveOptions?: {
//       /**
//        * Number of milliseconds to delay the debounce function
//        */
//       waitMs: number
//    }
//    /**
//     * function used to merge updates from the server with the local changes to
//     * the server data.  if undefined the hook will ignore background updates from
//     * the server and local changes will overwrite data from the server.
//     */
//    merge?: MergeFunc<TQueryFnData>
//    /**
//     * Ask the user to confirm before leaving the page if there are local
//     * modification to server data.  If false or undefined the user is allowed to
//     * leave the page.
//     */
//    alertIfUnsavedChanges?: boolean
//    /**
//     * boolean used to determine if the mutate function should be called, defaults to true
//     */
//    mutateEnabled?: boolean
//    /**
//     * If you want to pass your own draft you can
//     */
//    draftProvider?: UseAutoSyncDraftProvider<TQueryFnData>
// }): UseAutoSyncResult<
//    TQueryFnData,
//    TQueryError,
//    TMutationData,
//    TMutationError,
//    TMutationContext
// > {
//    const [stateDraft, setStateDraft] = useState<TQueryFnData | undefined>(
//       undefined,
//    )

//    const draft = draftProvider !== undefined ? draftProvider.draft : stateDraft
//    const setDraft =
//       draftProvider !== undefined ? draftProvider.setDraft : setStateDraft

//    // create a stable ref to the draft so we can memoize the save function
//    const draftRef = useRef<TQueryFnData | undefined>(undefined)
//    draftRef.current = draft

//    // create a stable ref to the merge so we can memoize the merge effect
//    const mergeRef = useRef<MergeFunc<TQueryFnData> | undefined>(undefined)
//    mergeRef.current = merge

//    const queryResult = useSuspenseQuery(queryOptions)

//    // we provide options to useMutation that optimistically update our state
//    const mutationResult = useMutation({
//       ...mutationOptions,
//       onMutate: async (draft) => {
//          setDraft(undefined)
//          // Return a context object with the snapshotted value
//          return {
//             ...mutationOptions.onMutate?.(draft),
//          } as unknown as never
//       },
//       onError: (err, prevDraft, context) => {
//          // if the user has not made any more local changes reset the draft
//          // to last known state
//          if (draft === undefined) {
//             setDraft(prevDraft)
//          } else {
//             const mergeFunc = mergeRef.current
//             // if the user has defined a merge func merge the previous and current changes
//             if (mergeFunc) {
//                setDraft(mergeFunc(prevDraft, draft))
//             } else {
//                // rollback the draft to the last known state
//                setDraft(prevDraft)
//             }
//          }
//          return mutationOptions.onError?.(err, prevDraft, context)
//       },
//       onSettled: (data, error, variables, context) => {
//          return mutationOptions?.onSettled?.(data, error, variables, context)
//       },
//    })

//    const { mutate } = mutationResult

//    const pendingSave = useRef(false)
//    const mutateEnabledRef = useRef(mutateEnabled)
//    mutateEnabledRef.current = mutateEnabled

//    // return a stable save function
//    const save = useCallback(() => {
//       if (draftRef.current !== undefined) {
//          if (mutateEnabledRef.current === false) {
//             pendingSave.current = true
//          } else {
//             mutate(draftRef.current)
//          }
//       }
//    }, [mutate])

//    const saveDebounced = useMemo(
//       () =>
//          debounce(save, {
//             waitMs: autoSaveOptions?.waitMs,
//          }),
//       [autoSaveOptions?.waitMs, save],
//    )

//    // clean up saveDebounced on unmount to avoid leaks
//    useEffect(() => {
//       const prevSaveDebounced = saveDebounced
//       return () => {
//          prevSaveDebounced.cancel()
//       }
//    }, [saveDebounced])

//    // call saveDebounced when the draft changes
//    useEffect(() => {
//       // check that autoSave is enabled and there are local changes to save
//       if (autoSaveOptions?.waitMs !== undefined && draft !== undefined) {
//          saveDebounced.call()
//       }
//    }, [saveDebounced, draft, autoSaveOptions?.waitMs])

//    // create a function which saves and cancels the debounced save
//    const saveAndCancelDebounced = useMemo(
//       () => () => {
//          saveDebounced.cancel()
//          save()
//       },
//       [save, saveDebounced],
//    )

//    // automatically save if we enable mutation and are pending a save
//    if (mutateEnabledRef.current === true && pendingSave.current === true) {
//       pendingSave.current = false
//       saveAndCancelDebounced()
//    }

//    const shouldPreventUserFromLeaving =
//       draft !== undefined && alertIfUnsavedChanges

//    useBlocker({
//       condition: shouldPreventUserFromLeaving,
//    })

//    // merge the local data with the server data when the server data changes
//    const currentDraftValue = useRef(draft)
//    currentDraftValue.current = draft

//    useEffect(() => {
//       const serverData = queryResult.data
//       const currentMergeFunc = mergeRef.current
//       if (
//          serverData !== undefined &&
//          currentMergeFunc !== undefined &&
//          currentDraftValue.current !== undefined
//       ) {
//          setDraft(currentMergeFunc(serverData, currentDraftValue.current))
//       }
//    }, [queryResult.data, setDraft])

//    const saveStatus: AutoSyncSaveStatus = queryResult.isLoading
//       ? "loading"
//       : mutationResult.isPending
//         ? "saving"
//         : mutationResult.isError || queryResult.isError
//           ? "error"
//           : queryResult.data === draft
//             ? "saved"
//             : "unsaved"

//    return {
//       save: saveAndCancelDebounced,
//       setDraft,
//       draft: draft ?? queryResult.data,
//       queryResult,
//       mutationResult,
//       saveStatus,
//    }
// }
