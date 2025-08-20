/**
 * the helpers in this file are repurposed version of the system to use token destination instead of position
 */

import { TokenPF2e } from "foundry-pf2e";

function getRealDestinationBounds(token: TokenPF2e): PIXI.Rectangle {
    const bounds = token.bounds;
    const destination = token.document.movement.destination;

    return new PIXI.Rectangle(destination.x, destination.y, bounds.width, bounds.height);
}

function getRealElevation(token: Maybe<TokenPF2e>): number {
    return token?.document.movement.destination.elevation ?? 0;
}

/**
 * https://github.com/foundryvtt/pf2e/blob/f26bfcc353ebd58efd6d1140cdb8e20688acaea8/src/module/canvas/token/object.ts#L478
 */
function distanceBetween(origin: TokenPF2e, target: TokenPF2e): number {
    if (!canvas.ready) return NaN;

    if (origin === target) return 0;

    if (canvas.grid.type !== CONST.GRID_TYPES.SQUARE) {
        const waypoints: GridMeasurePathWaypoint[] = [
            { x: origin.x, y: origin.y },
            { x: target.x, y: target.y },
        ];
        return Math.round(canvas.grid.measurePath(waypoints).distance);
    }

    const selfElevation = getRealElevation(origin);
    const targetElevation = getRealElevation(target) ?? selfElevation;
    const originBounds = getRealDestinationBounds(origin);
    const targetBounds = getRealDestinationBounds(target);
    if (selfElevation === targetElevation || !origin.actor || !targetBounds || !target.actor) {
        return measureDistanceCuboid(originBounds, targetBounds);
    }

    return measureDistanceCuboid(originBounds, targetBounds, { token: origin, target });
}

/**
 * https://github.com/foundryvtt/pf2e/blob/f26bfcc353ebd58efd6d1140cdb8e20688acaea8/src/module/canvas/helpers.ts#L10
 */
function measureDistanceCuboid(
    r0: PIXI.Rectangle,
    r1: PIXI.Rectangle,
    {
        reach = null,
        token = null,
        target = null,
    }: {
        reach?: number | null;
        token?: TokenPF2e | null;
        target?: TokenPF2e | null;
    } = {}
): number {
    if (canvas.grid.type !== CONST.GRID_TYPES.SQUARE) {
        return canvas.grid.measurePath([r0, r1]).distance;
    }

    const gridWidth = canvas.grid.sizeX;

    const distance = {
        dx: 0,
        dy: 0,
        dz: 0,
    };
    // Return early if the rectangles overlap
    const rectanglesOverlap = [
        [r0, r1],
        [r1, r0],
    ].some(
        ([rA, rB]) =>
            rB.right > rA.left && rB.left < rA.right && rB.bottom > rA.top && rB.top < rA.bottom
    );
    if (rectanglesOverlap) {
        distance.dx = 0;
        distance.dy = 0;
    } else {
        // Snap the dimensions and position of the rectangle to grid square units
        const snapBounds = (
            rectangle: PIXI.Rectangle,
            { toward }: { toward: PIXI.Rectangle }
        ): PIXI.Rectangle => {
            const roundLeft = rectangle.left < toward.left ? Math.ceil : Math.floor;
            const roundTop = rectangle.top < toward.top ? Math.ceil : Math.floor;

            const left = roundLeft(rectangle.left / gridWidth) * gridWidth;
            const top = roundTop(rectangle.top / gridWidth) * gridWidth;
            const width = Math.ceil(rectangle.width / gridWidth) * gridWidth;
            const height = Math.ceil(rectangle.height / gridWidth) * gridWidth;

            return new PIXI.Rectangle(left, top, width, height);
        };

        // Find the minimum distance between the rectangles for each dimension
        const r0Snapped = snapBounds(r0, { toward: r1 });
        const r1Snapped = snapBounds(r1, { toward: r0 });
        distance.dx =
            Math.max(r0Snapped.left - r1Snapped.right, r1Snapped.left - r0Snapped.right, 0) +
            gridWidth;
        distance.dy =
            Math.max(r0Snapped.top - r1Snapped.bottom, r1Snapped.top - r0Snapped.bottom, 0) +
            gridWidth;
    }

    const selfElevation = getRealElevation(token);
    const targetElevation = getRealElevation(target);

    if (token && target && selfElevation !== targetElevation && token.actor && target.actor) {
        const [selfDimensions, targetDimensions] = [
            token.actor.dimensions,
            target.actor.dimensions,
        ];

        const gridSize = canvas.dimensions.size;
        const gridDistance = canvas.dimensions.distance;

        const elevation0 = Math.floor((selfElevation / gridDistance) * gridSize);
        const height0 = Math.floor((selfDimensions.height / gridDistance) * gridSize);
        const elevation1 = Math.floor((targetElevation / gridDistance) * gridSize);
        const height1 = Math.floor((targetDimensions.height / gridDistance) * gridSize);

        // simulate xz plane
        const xzPlane = {
            self: new PIXI.Rectangle(r0.x, elevation0, r0.width, height0),
            target: new PIXI.Rectangle(r1.x, elevation1, r1.width, height1),
        };

        // check for overlappig
        const elevationOverlap = [
            [xzPlane.self, xzPlane.target],
            [xzPlane.target, xzPlane.self],
        ].some(([rA, rB]) => rB.bottom > rA.top && rB.top < rA.bottom);
        if (elevationOverlap) {
            distance.dz = 0;
        } else {
            // Snap the dimensions and position of the rectangle to grid square units
            const snapBounds = (
                rectangle: PIXI.Rectangle,
                { toward }: { toward: PIXI.Rectangle }
            ): PIXI.Rectangle => {
                const roundLeft = rectangle.left < toward.left ? Math.ceil : Math.floor;
                const roundTop = rectangle.top < toward.top ? Math.ceil : Math.floor;

                const left = roundLeft(rectangle.left / gridWidth) * gridWidth;
                const top = roundTop(rectangle.top / gridWidth) * gridWidth;
                const width = Math.ceil(rectangle.width / gridWidth) * gridWidth;
                const height = Math.ceil(rectangle.height / gridWidth) * gridWidth;

                return new PIXI.Rectangle(left, top, width, height);
            };

            // Find the minimum distance between the rectangles for each dimension
            const r0Snapped = snapBounds(xzPlane.self, { toward: xzPlane.target });
            const r1Snapped = snapBounds(xzPlane.target, { toward: xzPlane.self });
            distance.dz =
                Math.max(r0Snapped.top - r1Snapped.bottom, r1Snapped.top - r0Snapped.bottom, 0) +
                gridWidth;
        }
    } else {
        distance.dz = 0;
    }

    return measureDistanceOnGrid(distance, { reach });
}

/**
 * https://github.com/foundryvtt/pf2e/blob/f26bfcc353ebd58efd6d1140cdb8e20688acaea8/src/module/canvas/helpers.ts#L134
 */
function measureDistanceOnGrid(
    segment: { dx: number; dy: number; dz?: number | null },
    { reach = null }: { reach?: number | null } = {}
): number {
    if (!canvas.dimensions) return NaN;

    const gridSize = canvas.dimensions.size;
    const gridDistance = canvas.dimensions.distance;

    const nx = Math.ceil(Math.abs(segment.dx / gridSize));
    const ny = Math.ceil(Math.abs(segment.dy / gridSize));
    const nz = Math.ceil(Math.abs((segment.dz || 0) / gridSize));

    // ingore the lowest difference
    const sortedDistance = [nx, ny, nz].sort((a, b) => a - b);
    // Get the number of straight and diagonal moves
    const squares = {
        doubleDiagonal: sortedDistance[0],
        diagonal: sortedDistance[1] - sortedDistance[0],
        straight: sortedDistance[2] - sortedDistance[1],
    };

    // "Unlike with measuring most distances, 10-foot reach can reach 2 squares diagonally." (CRB pg 455)
    const reduction = squares.diagonal + squares.doubleDiagonal > 1 && reach === 10 ? 1 : 0;

    // Diagonals in PF pretty much count as 1.5 times a straight
    // for diagonals across the x, y, and z axis count it as 1.75 as a best guess
    const distance =
        Math.floor(squares.doubleDiagonal * 1.75 + squares.diagonal * 1.5 + squares.straight) -
        reduction;

    return distance * gridDistance;
}

export { distanceBetween };
